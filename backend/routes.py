from fastapi import APIRouter, HTTPException
from models import StudentQuery, StudentQueryCreate, College, Course
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Get db from server.py via dependency
from server import db

# Student Query Endpoints
@router.post("/queries", response_model=dict)
async def create_query(query_data: StudentQueryCreate):
    try:
        query_dict = query_data.dict()
        query_obj = StudentQuery(**query_dict)
        
        # Insert into database
        result = await db.student_queries.insert_one(query_obj.dict())
        
        logger.info(f"Query created successfully: {query_obj.id}")
        
        return {
            "success": True,
            "message": "Query submitted successfully! We'll contact you soon.",
            "query_id": query_obj.id
        }
    except Exception as e:
        logger.error(f"Error creating query: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit query")

@router.get("/queries", response_model=dict)
async def get_all_queries():
    try:
        queries = await db.student_queries.find().sort("created_at", -1).to_list(1000)
        return {
            "success": True,
            "queries": queries,
            "count": len(queries)
        }
    except Exception as e:
        logger.error(f"Error fetching queries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch queries")

@router.get("/queries/{query_id}", response_model=dict)
async def get_query(query_id: str):
    try:
        query = await db.student_queries.find_one({"id": query_id})
        if not query:
            raise HTTPException(status_code=404, detail="Query not found")
        
        return {
            "success": True,
            "query": query
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching query: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch query")

# College Endpoints
@router.get("/colleges", response_model=dict)
async def get_all_colleges():
    try:
        colleges = await db.colleges.find().to_list(1000)
        return {
            "success": True,
            "colleges": colleges,
            "count": len(colleges)
        }
    except Exception as e:
        logger.error(f"Error fetching colleges: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch colleges")

@router.get("/colleges/{college_id}", response_model=dict)
async def get_college(college_id: str):
    try:
        college = await db.colleges.find_one({"id": college_id})
        if not college:
            raise HTTPException(status_code=404, detail="College not found")
        
        return {
            "success": True,
            "college": college
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching college: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch college")

# Course Endpoints
@router.get("/courses", response_model=dict)
async def get_all_courses():
    try:
        courses = await db.courses.find().to_list(1000)
        return {
            "success": True,
            "courses": courses,
            "count": len(courses)
        }
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch courses")

@router.get("/courses/{course_id}", response_model=dict)
async def get_course(course_id: str):
    try:
        # Try to find by id or name
        course = await db.courses.find_one({
            "$or": [
                {"id": course_id},
                {"name": {"$regex": f"^{course_id}$", "$options": "i"}}
            ]
        })
        
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        return {
            "success": True,
            "course": course
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching course: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch course")