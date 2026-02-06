"""
Backend API tests for Edu Advisor Educational Consultancy
Tests:
- Admin Authentication
- Admin Admissions CRUD (Add, Edit, Delete)
- Admin Consultant Management
- Consultant Login
- Consultant Admissions Viewing
"""

import pytest
import requests
import os
import uuid
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
API_URL = f"{BASE_URL}/api"

# Test credentials
ADMIN_USER_ID = "ADMIN"
ADMIN_PASSWORD = "Eduadvisors@2026"
CONSULTANT_USER_ID = "PRIYAMPATRA"
CONSULTANT_PASSWORD = "Priyam123!@#"
CONSULTANT_NAME = "PRIYAM PATRA"


class TestHealthCheck:
    """Basic health check tests"""
    
    def test_api_accessible(self):
        """Test that API is accessible"""
        response = requests.get(f"{API_URL}/queries")
        assert response.status_code == 200, f"API not accessible: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"✓ API accessible - {len(data.get('queries', []))} queries found")


class TestAdminAuthentication:
    """Test admin login flow (Note: Auth happens client-side, testing API endpoints)"""
    
    def test_admin_consultants_endpoint(self):
        """Test admin can access consultants endpoint"""
        response = requests.get(f"{API_URL}/admin/consultants")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "consultants" in data
        print(f"✓ Admin consultants endpoint accessible - {len(data['consultants'])} consultants")
    
    def test_admin_admissions_endpoint(self):
        """Test admin can access admissions endpoint"""
        response = requests.get(f"{API_URL}/admin/admissions")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "admissions" in data
        print(f"✓ Admin admissions endpoint accessible - {len(data['admissions'])} admissions")


class TestConsultantAuthentication:
    """Test consultant login"""
    
    def test_consultant_login_valid(self):
        """Test consultant login with valid credentials"""
        response = requests.post(
            f"{API_URL}/consultant/login",
            params={"user_id": CONSULTANT_USER_ID, "password": CONSULTANT_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        # API returns consultant_name, not name
        assert data.get("consultant_name") == CONSULTANT_NAME
        print(f"✓ Consultant login successful - Name: {data.get('consultant_name')}")
    
    def test_consultant_login_invalid(self):
        """Test consultant login with invalid credentials"""
        response = requests.post(
            f"{API_URL}/consultant/login",
            params={"user_id": "INVALID", "password": "wrongpass"}
        )
        assert response.status_code == 401
        print("✓ Invalid credentials correctly rejected")


class TestAdmissionsCRUD:
    """Test Admissions CRUD operations"""
    
    @pytest.fixture
    def test_admission_data(self):
        """Generate test admission data"""
        return {
            "student_name": f"TEST_Student_{uuid.uuid4().hex[:8]}",
            "course": "B.Tech Computer Science",
            "college": "IIT Delhi",
            "admission_date": "2026-01-15",
            "consultant_id": CONSULTANT_USER_ID,
            "consultant_name": CONSULTANT_NAME,
            "payout_amount": 50000.0,
            "payout_status": "PAYOUT NOT CREDITED YET"
        }
    
    def test_create_admission(self, test_admission_data):
        """Test creating a new admission"""
        response = requests.post(
            f"{API_URL}/admin/admissions",
            params=test_admission_data
        )
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "admission_id" in data
        admission_id = data["admission_id"]
        print(f"✓ Admission created - ID: {admission_id}")
        
        # Verify admission was persisted by fetching all admissions
        get_response = requests.get(f"{API_URL}/admin/admissions")
        assert get_response.status_code == 200
        admissions = get_response.json().get("admissions", [])
        created_admission = next((a for a in admissions if a["id"] == admission_id), None)
        assert created_admission is not None, "Admission not found after creation"
        assert created_admission["student_name"] == test_admission_data["student_name"]
        print(f"✓ Admission verified in database")
        
        # Cleanup
        requests.delete(f"{API_URL}/admin/admissions/{admission_id}")
        return admission_id
    
    def test_update_admission(self, test_admission_data):
        """Test updating an admission"""
        # First create an admission
        create_response = requests.post(
            f"{API_URL}/admin/admissions",
            params=test_admission_data
        )
        assert create_response.status_code == 200
        admission_id = create_response.json()["admission_id"]
        
        # Update the admission
        update_params = {
            "student_name": test_admission_data["student_name"],
            "course": test_admission_data["course"],
            "college": test_admission_data["college"],
            "admission_date": test_admission_data["admission_date"],
            "payout_amount": 75000.0,  # Updated amount
            "payout_status": "PAYOUT REFLECTED"  # Updated status
        }
        update_response = requests.put(
            f"{API_URL}/admin/admissions/{admission_id}",
            params=update_params
        )
        assert update_response.status_code == 200, f"Update failed: {update_response.text}"
        
        # Verify update
        get_response = requests.get(f"{API_URL}/admin/admissions")
        admissions = get_response.json().get("admissions", [])
        updated_admission = next((a for a in admissions if a["id"] == admission_id), None)
        assert updated_admission is not None
        assert updated_admission["payout_amount"] == 75000.0
        assert updated_admission["payout_status"] == "PAYOUT REFLECTED"
        print(f"✓ Admission updated and verified - Payout: ₹75000, Status: PAYOUT REFLECTED")
        
        # Cleanup
        requests.delete(f"{API_URL}/admin/admissions/{admission_id}")
    
    def test_delete_admission(self, test_admission_data):
        """Test deleting an admission"""
        # First create an admission
        create_response = requests.post(
            f"{API_URL}/admin/admissions",
            params=test_admission_data
        )
        assert create_response.status_code == 200
        admission_id = create_response.json()["admission_id"]
        
        # Delete the admission
        delete_response = requests.delete(f"{API_URL}/admin/admissions/{admission_id}")
        assert delete_response.status_code == 200, f"Delete failed: {delete_response.text}"
        
        # Verify deletion
        get_response = requests.get(f"{API_URL}/admin/admissions")
        admissions = get_response.json().get("admissions", [])
        deleted_admission = next((a for a in admissions if a["id"] == admission_id), None)
        assert deleted_admission is None, "Admission still exists after deletion"
        print(f"✓ Admission deleted and verified")


class TestConsultantAdmissionsView:
    """Test consultant viewing their admissions"""
    
    def test_consultant_view_admissions(self):
        """Test consultant can view their credited admissions"""
        response = requests.get(f"{API_URL}/consultant/admissions/{CONSULTANT_USER_ID}")
        assert response.status_code == 200, f"Failed to get admissions: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "admissions" in data
        print(f"✓ Consultant can view admissions - {len(data['admissions'])} admissions found")
    
    def test_consultant_admission_flow(self):
        """Test full flow: Admin adds admission -> Consultant sees it"""
        # Create test admission for the consultant
        test_data = {
            "student_name": f"TEST_FlowStudent_{uuid.uuid4().hex[:8]}",
            "course": "MBA",
            "college": "IIM Ahmedabad",
            "admission_date": "2026-01-20",
            "consultant_id": CONSULTANT_USER_ID,
            "consultant_name": CONSULTANT_NAME,
            "payout_amount": 100000.0,
            "payout_status": "PAYOUT NOT CREDITED YET"
        }
        
        # Admin creates admission
        create_response = requests.post(
            f"{API_URL}/admin/admissions",
            params=test_data
        )
        assert create_response.status_code == 200
        admission_id = create_response.json()["admission_id"]
        print(f"✓ Admin created admission for consultant")
        
        # Consultant views their admissions
        consultant_response = requests.get(f"{API_URL}/consultant/admissions/{CONSULTANT_USER_ID}")
        assert consultant_response.status_code == 200
        admissions = consultant_response.json().get("admissions", [])
        
        # Find our test admission
        test_admission = next((a for a in admissions if a["id"] == admission_id), None)
        assert test_admission is not None, "Consultant cannot see the admission"
        assert test_admission["student_name"] == test_data["student_name"]
        assert test_admission["payout_amount"] == test_data["payout_amount"]
        print(f"✓ Consultant can see the admission - Student: {test_admission['student_name']}")
        
        # Cleanup
        requests.delete(f"{API_URL}/admin/admissions/{admission_id}")


class TestConsultantManagement:
    """Test Consultant Management (Admin feature)"""
    
    def test_get_all_consultants(self):
        """Test fetching all consultants"""
        response = requests.get(f"{API_URL}/admin/consultants")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "consultants" in data
        
        # Verify our test consultant exists
        consultants = data["consultants"]
        priyam = next((c for c in consultants if c["user_id"] == CONSULTANT_USER_ID), None)
        assert priyam is not None, "Test consultant PRIYAMPATRA not found"
        assert priyam["name"] == CONSULTANT_NAME
        print(f"✓ Got {len(consultants)} consultants - PRIYAMPATRA found")
    
    def test_consultant_crud_flow(self):
        """Test full consultant CRUD - Create, Read, Update, Delete"""
        test_user_id = f"TEST_{uuid.uuid4().hex[:6].upper()}"
        test_name = "Test Consultant"
        test_password = "TestPass123!"
        
        # CREATE consultant
        create_response = requests.post(
            f"{API_URL}/admin/consultants",
            params={
                "user_id": test_user_id,
                "name": test_name,
                "password": test_password
            }
        )
        assert create_response.status_code == 200, f"Create failed: {create_response.text}"
        print(f"✓ Created consultant: {test_user_id}")
        
        # READ - Verify in list
        get_response = requests.get(f"{API_URL}/admin/consultants")
        consultants = get_response.json().get("consultants", [])
        created = next((c for c in consultants if c["user_id"] == test_user_id), None)
        assert created is not None, "Consultant not found after creation"
        assert created["name"] == test_name
        print(f"✓ Verified consultant in list")
        
        # UPDATE - Change user_id (Name should remain unchanged)
        new_user_id = f"TEST_{uuid.uuid4().hex[:6].upper()}"
        update_response = requests.put(
            f"{API_URL}/admin/consultants/{test_user_id}",
            params={"new_user_id": new_user_id, "password": "NewPass456!"}
        )
        assert update_response.status_code == 200, f"Update failed: {update_response.text}"
        print(f"✓ Updated user_id: {test_user_id} -> {new_user_id}")
        
        # Verify update - Name should be same, user_id changed
        get_response = requests.get(f"{API_URL}/admin/consultants")
        consultants = get_response.json().get("consultants", [])
        updated = next((c for c in consultants if c["user_id"] == new_user_id), None)
        assert updated is not None, "Updated consultant not found"
        assert updated["name"] == test_name, "Name should not change"
        print(f"✓ Verified name unchanged: {updated['name']}")
        
        # DELETE consultant
        delete_response = requests.delete(f"{API_URL}/admin/consultants/{new_user_id}")
        assert delete_response.status_code == 200, f"Delete failed: {delete_response.text}"
        
        # Verify deletion
        get_response = requests.get(f"{API_URL}/admin/consultants")
        consultants = get_response.json().get("consultants", [])
        deleted = next((c for c in consultants if c["user_id"] == new_user_id), None)
        assert deleted is None, "Consultant still exists after deletion"
        print(f"✓ Consultant deleted and verified")


class TestPayoutStatuses:
    """Test payout status updates for admissions"""
    
    def test_payout_status_transitions(self):
        """Test all payout status values"""
        # Create admission
        test_data = {
            "student_name": f"TEST_PayoutTest_{uuid.uuid4().hex[:8]}",
            "course": "B.Tech",
            "college": "NIT Trichy",
            "admission_date": "2026-02-01",
            "consultant_id": CONSULTANT_USER_ID,
            "consultant_name": CONSULTANT_NAME,
            "payout_amount": 30000.0,
            "payout_status": "PAYOUT NOT CREDITED YET"
        }
        
        create_response = requests.post(
            f"{API_URL}/admin/admissions",
            params=test_data
        )
        assert create_response.status_code == 200
        admission_id = create_response.json()["admission_id"]
        
        # Test each payout status
        statuses = [
            "PAYOUT NOT CREDITED YET",
            "PAYOUT REFLECTED",
            "CONSULTANT'S COMMISION GIVEN"
        ]
        
        for status in statuses:
            update_response = requests.put(
                f"{API_URL}/admin/admissions/{admission_id}",
                params={
                    "student_name": test_data["student_name"],
                    "course": test_data["course"],
                    "college": test_data["college"],
                    "admission_date": test_data["admission_date"],
                    "payout_amount": test_data["payout_amount"],
                    "payout_status": status
                }
            )
            assert update_response.status_code == 200, f"Failed to set status to '{status}'"
            
            # Verify
            get_response = requests.get(f"{API_URL}/admin/admissions")
            admissions = get_response.json().get("admissions", [])
            admission = next((a for a in admissions if a["id"] == admission_id), None)
            assert admission["payout_status"] == status
            print(f"✓ Payout status set to: {status}")
        
        # Cleanup
        requests.delete(f"{API_URL}/admin/admissions/{admission_id}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
