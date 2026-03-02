# Consultant credentials - Default/Initial consultants
DEFAULT_CONSULTANTS = {
    "PRIYAMPATRA": {"name": "PRIYAM PATRA", "password": "Priyam123!@#"},
    "AK007": {"name": "ARKAJYOTI PAL", "password": "7001377649"},
    "NILKANTHA": {"name": "NILKANTHA DWIBEDI", "password": "nil12345"},
    "SWARAJ_EDU": {"name": "SWARAJ SINHA", "password": "Swaraj@5533"},
    "SOUMYADEEP_EDU": {"name": "SOUMYADEEP MAHATA", "password": "Mahata2005@"},
    "SUPRITIDEY123": {"name": "SUPRITI DEY", "password": "#bani5678"},
    "SUSMITA98832": {"name": "SUSMITA MANNA", "password": "Mannamanna7797"},
    "SHUVAM360": {"name": "SHUVAM DIKSHIT", "password": "Donshuvam"},
    "DEEP_EDU": {"name": "DEEP PRAMANIK", "password": "Deep@9332320439"},
    "ARPITA234": {"name": "ARPITA PAL", "password": "Namita18"},
    "SAYANTIKADEY@909": {"name": "SAYANTIKA DEY", "password": "Sayantikadey@999"},
    "SAYANTIKA_EDU": {"name": "SAYANTIKA BAR", "password": "Sayantika@70478268217"},
    "ISHIKA_EDU": {"name": "ISHIKA DAS", "password": "Ishi.ka@2026"},
    "GIRISAYAN83488": {"name": "SAYAN GIRI", "password": "Sayan@07"},
    "MOU.BU01": {"name": "MOUTUSI SAMANTA", "password": "721439"},
    "SHRABANI_EDU": {"name": "SHRABANI SINGH", "password": "Shra.bani2026"},
    "PUJA_EDU": {"name": "PUJA BHUNIA", "password": "Pu.ja2026"},
    "SUBHADIP_EDU": {"name": "SUBHADIP MAITY", "password": "Subha.dip@2026"},
    "BRISTI_EDU": {"name": "BRISTI PRADHAN", "password": "Bri.sti2026"},
    "PREYASI_EDU": {"name": "PREYASI JANA", "password": "Preya.si@2026"},
    "ARNAB_EDU": {"name": "ARNAB MANDAL", "password": "Ar.nab@2026"},
    "AYAN_EDU": {"name": "AYAN MANDAL", "password": "Ayan@2026"},
    "DEBMALYA_EDU": {"name": "DEBMALYA CHAKRABORTY", "password": "Deb.malya"},
    "SOYALI_EDU": {"name": "SOYALI NANDA", "password": "Soyali2026@"}
}

# Database reference - will be set by init_consultants_db
_db = None

async def init_consultants_db(database):
    """Initialize consultants collection in MongoDB"""
    global _db
    _db = database
    
    # Check if consultants collection exists and has data
    count = await _db.consultants.count_documents({})
    
    if count == 0:
        # Seed default consultants into database
        for user_id, data in DEFAULT_CONSULTANTS.items():
            await _db.consultants.insert_one({
                "user_id": user_id,
                "name": data["name"],
                "password": data["password"]
            })
        print(f"Seeded {len(DEFAULT_CONSULTANTS)} default consultants into database")
    else:
        print(f"Consultants collection already has {count} records")

async def verify_consultant_async(user_id: str, password: str):
    """Verify consultant credentials from database"""
    if _db is None:
        # Fallback to defaults if DB not initialized
        if user_id in DEFAULT_CONSULTANTS:
            if DEFAULT_CONSULTANTS[user_id]["password"] == password:
                return {
                    "success": True,
                    "consultant_id": user_id,
                    "consultant_name": DEFAULT_CONSULTANTS[user_id]["name"]
                }
        return {"success": False, "message": "Invalid credentials"}
    
    consultant = await _db.consultants.find_one({"user_id": user_id}, {"_id": 0})
    if consultant and consultant["password"] == password:
        return {
            "success": True,
            "consultant_id": user_id,
            "consultant_name": consultant["name"]
        }
    return {"success": False, "message": "Invalid credentials"}

async def get_consultant_name_async(user_id: str):
    """Get consultant name by user ID from database"""
    if _db is None:
        # Fallback to defaults
        if user_id in DEFAULT_CONSULTANTS:
            return DEFAULT_CONSULTANTS[user_id]["name"]
        return None
    
    consultant = await _db.consultants.find_one({"user_id": user_id}, {"_id": 0})
    if consultant:
        return consultant["name"]
    return None

async def get_all_consultants_async():
    """Get all consultants from database"""
    if _db is None:
        return [
            {"user_id": uid, "name": data["name"], "password": data["password"]}
            for uid, data in DEFAULT_CONSULTANTS.items()
        ]
    
    consultants = await _db.consultants.find({}, {"_id": 0}).to_list(1000)
    return consultants

async def add_consultant_async(user_id: str, name: str, password: str):
    """Add a new consultant to database"""
    if _db is None:
        return {"success": False, "message": "Database not initialized"}
    
    existing = await _db.consultants.find_one({"user_id": user_id})
    if existing:
        return {"success": False, "message": "User ID already exists"}
    
    await _db.consultants.insert_one({
        "user_id": user_id,
        "name": name,
        "password": password
    })
    return {"success": True, "message": "Consultant added successfully"}

async def update_consultant_async(user_id: str, new_user_id: str = None, password: str = None, name: str = None):
    """Update consultant details in database"""
    if _db is None:
        return {"success": False, "message": "Database not initialized"}
    
    existing = await _db.consultants.find_one({"user_id": user_id})
    if not existing:
        return {"success": False, "message": "Consultant not found"}
    
    update_data = {}
    final_user_id = user_id
    
    # If changing user_id
    if new_user_id and new_user_id != user_id:
        # Check if new user_id already exists
        existing_new = await _db.consultants.find_one({"user_id": new_user_id})
        if existing_new:
            return {"success": False, "message": "New User ID already exists"}
        update_data["user_id"] = new_user_id
        final_user_id = new_user_id
    
    if password:
        update_data["password"] = password
    
    if name:
        update_data["name"] = name
    
    if update_data:
        await _db.consultants.update_one({"user_id": user_id}, {"$set": update_data})
    
    return {"success": True, "message": "Consultant updated successfully", "user_id": final_user_id}

async def delete_consultant_async(user_id: str):
    """Delete a consultant from database"""
    if _db is None:
        return {"success": False, "message": "Database not initialized"}
    
    result = await _db.consultants.delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        return {"success": False, "message": "Consultant not found"}
    return {"success": True, "message": "Consultant deleted successfully"}


# Synchronous wrappers for backwards compatibility (used in routes before async)
def verify_consultant(user_id: str, password: str):
    """Verify consultant credentials - sync fallback"""
    if user_id in DEFAULT_CONSULTANTS:
        if DEFAULT_CONSULTANTS[user_id]["password"] == password:
            return {
                "success": True,
                "consultant_id": user_id,
                "consultant_name": DEFAULT_CONSULTANTS[user_id]["name"]
            }
    return {"success": False, "message": "Invalid credentials"}

def get_consultant_name(user_id: str):
    """Get consultant name by user ID - sync fallback"""
    if user_id in DEFAULT_CONSULTANTS:
        return DEFAULT_CONSULTANTS[user_id]["name"]
    return None

def get_all_consultants():
    """Get all consultants - sync fallback"""
    return [
        {"user_id": uid, "name": data["name"], "password": data["password"]}
        for uid, data in DEFAULT_CONSULTANTS.items()
    ]

def add_consultant(user_id: str, name: str, password: str):
    """Add a new consultant - sync fallback"""
    return {"success": False, "message": "Use async version"}

def update_consultant(user_id: str, new_user_id: str = None, password: str = None):
    """Update consultant details - sync fallback"""
    return {"success": False, "message": "Use async version"}

def delete_consultant(user_id: str):
    """Delete a consultant - sync fallback"""
    return {"success": False, "message": "Use async version"}
