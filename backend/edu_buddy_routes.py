from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
import logging
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage
from edu_buddy_knowledge import EDU_BUDDY_KNOWLEDGE, POPULAR_QUERIES

load_dotenv()

logger = logging.getLogger(__name__)

router = APIRouter()

# System prompt for EDU BUDDY
EDU_BUDDY_SYSTEM_PROMPT = f"""You are EDU BUDDY, an expert educational counselling assistant for Edu Advisor consultancy in India. 

Your role is to help consultants provide accurate information to students about:
1. Entrance exam cut-offs (NEET, JEE Main, JEE Advanced, WBJEE, State CETs)
2. Course recommendations based on student's 12th marks, subjects, and interests
3. College suggestions with approximate fee structures
4. Career guidance and counselling

KNOWLEDGE BASE:
{EDU_BUDDY_KNOWLEDGE}

GUIDELINES:
- Always provide accurate, helpful information based on the knowledge base
- When discussing cut-offs, mention they are approximate and can vary year to year
- For fee structures, mention these are approximate and subject to change
- Be encouraging but realistic about student's options
- If asked about something not in your knowledge, provide general guidance
- Format responses clearly with bullet points when listing multiple items
- Keep responses concise but informative (suitable for phone conversations)
- Always suggest backup options along with primary recommendations

RESPONSE FORMAT:
- Use clear sections and bullet points
- Highlight important numbers (ranks, percentiles, fees)
- End with actionable advice when appropriate
"""

class ChatRequest(BaseModel):
    message: str
    session_id: str
    consultant_id: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    response: str
    session_id: str

@router.post("/edu-buddy/chat", response_model=ChatResponse)
async def chat_with_edu_buddy(request: ChatRequest):
    """Chat with EDU BUDDY AI assistant"""
    try:
        api_key = os.environ.get("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        # Initialize chat with Gemini
        chat = LlmChat(
            api_key=api_key,
            session_id=request.session_id,
            system_message=EDU_BUDDY_SYSTEM_PROMPT
        ).with_model("gemini", "gemini-3-flash-preview")
        
        # Create user message
        user_message = UserMessage(text=request.message)
        
        # Get response
        response = await chat.send_message(user_message)
        
        logger.info(f"EDU BUDDY response for session {request.session_id}")
        
        return ChatResponse(
            success=True,
            response=response,
            session_id=request.session_id
        )
        
    except Exception as e:
        logger.error(f"Error in EDU BUDDY chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get response: {str(e)}")

@router.get("/edu-buddy/popular-queries")
async def get_popular_queries():
    """Get popular queries for auto mode"""
    try:
        return {
            "success": True,
            "queries": POPULAR_QUERIES
        }
    except Exception as e:
        logger.error(f"Error fetching popular queries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch popular queries")

@router.post("/edu-buddy/analyze-student")
async def analyze_student_profile(
    subjects: str,
    marks_percentage: float,
    entrance_exams: Optional[str] = None,
    interests: Optional[str] = None,
    category: Optional[str] = "General"
):
    """Analyze student profile and recommend courses"""
    try:
        api_key = os.environ.get("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        analysis_prompt = f"""
Analyze this student profile and provide course recommendations:

STUDENT PROFILE:
- 12th Subjects: {subjects}
- Marks Percentage: {marks_percentage}%
- Entrance Exams Planning: {entrance_exams or 'Not specified'}
- Career Interests: {interests or 'Not specified'}
- Category: {category}

Based on this profile, provide:
1. Top 5 recommended courses with reasons
2. Best colleges for each course (with approximate fees)
3. Required entrance exams and expected cut-offs
4. Alternative career paths if main goal isn't achieved
5. Action plan for the student

Be specific and practical in your recommendations.
"""
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"analysis-{marks_percentage}",
            system_message=EDU_BUDDY_SYSTEM_PROMPT
        ).with_model("gemini", "gemini-3-flash-preview")
        
        user_message = UserMessage(text=analysis_prompt)
        response = await chat.send_message(user_message)
        
        return {
            "success": True,
            "analysis": response,
            "student_profile": {
                "subjects": subjects,
                "marks": marks_percentage,
                "exams": entrance_exams,
                "interests": interests,
                "category": category
            }
        }
        
    except Exception as e:
        logger.error(f"Error analyzing student profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze: {str(e)}")
