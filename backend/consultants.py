# Consultant credentials
CONSULTANTS = {
    "PRIYAMPATRA": {"name": "PRIYAM PATRA", "password": "Priyam123!@#"},
    "AK007": {"name": "ARKAJYOTI PAL", "password": "7001377649"},
    "NILKANTHA": {"name": "NILKANTHA DWIBEDI", "password": "nil12345"},
    "SWARAJ_EDU": {"name": "SWARAJ SINHA", "password": "Swaraj@5533"},
    "SOUMYADEEP_EDU": {"name": "SOUMYADEEP MAHATA", "password": "Mahata2005@"},
    "SUPRITIDEY123": {"name": "SUPRITI DEY", "password": "#bani5678"},
    "SUSMITA98832": {"name": "SUSMITA MANNA", "password": "Mannamanna7797"},
    "SHUVAM360": {"name": "SHUVAM DIKSHIT", "password": "Donshuvam"},
    "MANTRI_JI": {"name": "SANDIPAN MANTRI", "password": "Sree@2004"},
    "DEEP_EDU": {"name": "DEEP PRAMANIK", "password": "Deep@9332320439"},
    "ARPITA234": {"name": "ARPITA PAL", "password": "Namita18"},
    "SAYANTIKADEY@909": {"name": "SAYANTIKA DEY", "password": "Sayantikadey@999"},
    "SAYANTIKA_EDU": {"name": "SAYANTIKA BAR", "password": "Sayantika@70478268217"},
    "ISHIKA_EDU": {"name": "ISHIKA DAS", "password": "Ishi.ka@2026"},
    "GIRISAYAN83488": {"name": "SAYAN GIRI", "password": "Sayan@07"},
    "MOU.BU01": {"name": "MOUTUSI SAMANTA", "password": "721439"},
    "SHRABANI_EDU": {"name": "SHRABANI SINGH", "password": "Shra.bani2026"},
    "PUJA_EDU": {"name": "PUJA BHUNIA", "password": "Pu.ja2026"},
    "SUPRITI_EDU": {"name": "SUPRITI DAS", "password": "Su.priti@2026"},
    "SUBHADIP_EDU": {"name": "SUBHADIP MAITY", "password": "Subha.dip@2026"},
    "BRISTI_EDU": {"name": "BRISTI PRADHAN", "password": "Bri.sti2026"},
    "PREYASI_EDU": {"name": "PREYASI JANA", "password": "Preya.si@2026"},
    "ARNAB_EDU": {"name": "ARNAB MANDAL", "password": "Ar.nab@2026"},
    "AYAN_EDU": {"name": "AYAN MANDAL", "password": "Ayan@2026"}
}

def verify_consultant(user_id: str, password: str):
    """Verify consultant credentials"""
    if user_id in CONSULTANTS:
        if CONSULTANTS[user_id]["password"] == password:
            return {
                "success": True,
                "consultant_id": user_id,
                "consultant_name": CONSULTANTS[user_id]["name"]
            }
    return {"success": False, "message": "Invalid credentials"}

def get_consultant_name(user_id: str):
    """Get consultant name by user ID"""
    if user_id in CONSULTANTS:
        return CONSULTANTS[user_id]["name"]
    return None
