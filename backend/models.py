from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
from datetime import datetime
import uuid

# Student Query Models
class StudentQueryCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    current_institution: str
    course: str
    message: Optional[str] = ""

class StudentQuery(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    current_institution: str
    course: str
    message: str
    status: str = "new"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Placement Stats Model
class PlacementStats(BaseModel):
    average_package: str
    highest_package: str
    placement_rate: str

# College Models
class College(BaseModel):
    id: str
    name: str
    logo: Optional[str] = ""
    description: str
    website: str
    nirf_rank: int
    naac_grade: str
    location: str
    established_year: int
    specializations: List[str]
    placement_stats: PlacementStats
    facilities: List[str]
    top_recruiters: List[str]

# Course Models
class CollegeOffering(BaseModel):
    college_name: str
    average_placement: str
    top_companies: List[str]
    specialization: str
    why_recommended: str

class Course(BaseModel):
    id: str
    name: str
    full_name: str
    type: str  # "undergraduate" or "postgraduate"
    duration: str
    description: str
    career_prospects: List[str]
    why_choose: str
    colleges_offering: List[CollegeOffering]