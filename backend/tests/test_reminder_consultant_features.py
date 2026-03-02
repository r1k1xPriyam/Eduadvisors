"""
Tests for new Reminder & Consultant Management Features:
1. Consultant reminders with Already Followed Up / Ignore options
2. Admin delete reminders
3. Consultant management (MongoDB persistence)
4. Reports visibility
"""
import pytest
import requests
import os
import uuid
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')
API = f"{BASE_URL}/api"

# Test credentials
CONSULTANT_ID = "PRIYAMPATRA"
CONSULTANT_PASSWORD = "Priyam123!@#"
ADMIN_PASSWORD = "EDUadvisors@souvikCEO2026"


class TestConsultantLogin:
    """Test consultant login functionality"""
    
    def test_consultant_login_success(self):
        """Test valid consultant login returns consultant name"""
        response = requests.post(
            f"{API}/consultant/login",
            params={"user_id": CONSULTANT_ID, "password": CONSULTANT_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "consultant_name" in data
        assert data["consultant_id"] == CONSULTANT_ID
        print(f"✓ Consultant login successful: {data['consultant_name']}")
    
    def test_consultant_login_invalid_credentials(self):
        """Test invalid credentials return 401"""
        response = requests.post(
            f"{API}/consultant/login",
            params={"user_id": "INVALID_USER", "password": "wrong_password"}
        )
        assert response.status_code == 401
        print("✓ Invalid credentials correctly rejected")


class TestConsultantReminders:
    """Tests for consultant reminder endpoints - Already Followed Up & Ignore"""
    
    @pytest.fixture(autouse=True)
    def setup_test_report(self):
        """Create a test report with follow-up date for testing"""
        self.test_report_id = None
        
        # Create a test report with followup date (today)
        today = datetime.now().strftime('%Y-%m-%d')
        report_data = {
            "student_name": f"TEST_ReminderStudent_{uuid.uuid4().hex[:6]}",
            "contact_number": f"9999{uuid.uuid4().hex[:6]}",
            "institution_name": "Test Institution",
            "competitive_exam_preference": "JEE",
            "career_interest": "Engineering",
            "interest_scope": "ACTIVELY INTERESTED",
            "next_followup_date": today
        }
        
        response = requests.post(
            f"{API}/consultant/reports",
            params={"consultant_id": CONSULTANT_ID},
            json=report_data
        )
        
        if response.status_code == 200 and response.json().get("success"):
            self.test_report_id = response.json().get("report_id")
        
        yield
        
        # Cleanup - delete test report
        if self.test_report_id:
            requests.delete(f"{API}/consultant/reports/{self.test_report_id}")
    
    def test_get_consultant_reminders(self):
        """Test getting reminders for consultant - should return today/upcoming/overdue"""
        response = requests.get(f"{API}/consultant/reminders/{CONSULTANT_ID}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "today_reminders" in data
        assert "upcoming_reminders" in data
        assert "overdue_reminders" in data
        assert "total_pending" in data
        print(f"✓ Consultant reminders fetched: {data['total_pending']} pending")
    
    def test_mark_reminder_already_followed_up(self):
        """Test marking reminder as complete (Already Followed Up)"""
        if not self.test_report_id:
            pytest.skip("Test report not created")
        
        response = requests.put(
            f"{API}/consultant/reminders/{self.test_report_id}/complete",
            params={"consultant_id": CONSULTANT_ID}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "complete" in data["message"].lower() or "completed" in str(data).lower()
        print(f"✓ Reminder marked as 'Already Followed Up'")
    
    def test_ignore_reminder(self):
        """Test ignoring a reminder (Ignore button)"""
        # Create another test report for ignore test
        today = datetime.now().strftime('%Y-%m-%d')
        report_data = {
            "student_name": f"TEST_IgnoreStudent_{uuid.uuid4().hex[:6]}",
            "contact_number": f"8888{uuid.uuid4().hex[:6]}",
            "institution_name": "Test Institution",
            "competitive_exam_preference": "NEET",
            "career_interest": "Medical",
            "interest_scope": "LESS INTERESTED",
            "next_followup_date": today
        }
        
        create_response = requests.post(
            f"{API}/consultant/reports",
            params={"consultant_id": CONSULTANT_ID},
            json=report_data
        )
        assert create_response.status_code == 200
        report_id = create_response.json().get("report_id")
        
        # Now test ignore endpoint
        response = requests.put(
            f"{API}/consultant/reminders/{report_id}/ignore",
            params={"consultant_id": CONSULTANT_ID}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "ignored" in data["message"].lower()
        print(f"✓ Reminder ignored successfully")
        
        # Cleanup
        requests.delete(f"{API}/consultant/reports/{report_id}")


class TestAdminReminders:
    """Tests for admin reminder management"""
    
    def test_admin_get_all_reminders(self):
        """Test admin fetching all reminders"""
        response = requests.get(f"{API}/admin/reminders")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "today_reminders" in data
        assert "upcoming_reminders" in data
        assert "overdue_reminders" in data
        print(f"✓ Admin can view all reminders: {data.get('total_pending', 0)} total")
    
    def test_admin_delete_reminder(self):
        """Test admin deleting a reminder"""
        # First create a test report with reminder
        today = datetime.now().strftime('%Y-%m-%d')
        report_data = {
            "student_name": f"TEST_AdminDelete_{uuid.uuid4().hex[:6]}",
            "contact_number": f"7777{uuid.uuid4().hex[:6]}",
            "institution_name": "Test Institution",
            "competitive_exam_preference": "JEE",
            "career_interest": "Engineering",
            "interest_scope": "ACTIVELY INTERESTED",
            "next_followup_date": today
        }
        
        create_response = requests.post(
            f"{API}/consultant/reports",
            params={"consultant_id": CONSULTANT_ID},
            json=report_data
        )
        assert create_response.status_code == 200
        report_id = create_response.json().get("report_id")
        
        # Admin delete the reminder
        response = requests.delete(f"{API}/admin/reminders/{report_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "deleted" in data["message"].lower()
        print(f"✓ Admin deleted reminder successfully")
        
        # Cleanup - delete test report
        requests.delete(f"{API}/consultant/reports/{report_id}")


class TestConsultantManagement:
    """Tests for consultant CRUD - permanent MongoDB storage"""
    
    def test_get_all_consultants(self):
        """Test fetching all consultants"""
        response = requests.get(f"{API}/admin/consultants")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "consultants" in data
        assert len(data["consultants"]) > 0
        print(f"✓ Fetched {data['count']} consultants from MongoDB")
    
    def test_add_new_consultant(self):
        """Test adding a new consultant - should persist in MongoDB"""
        test_user_id = f"TEST_USER_{uuid.uuid4().hex[:6]}"
        response = requests.post(
            f"{API}/admin/consultants",
            params={
                "user_id": test_user_id,
                "name": "Test Consultant Name",
                "password": "TestPass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✓ Consultant {test_user_id} added permanently to database")
        
        # Verify consultant exists
        all_consultants = requests.get(f"{API}/admin/consultants").json()
        found = any(c["user_id"] == test_user_id for c in all_consultants["consultants"])
        assert found, "Newly added consultant not found in database"
        print(f"✓ Verified consultant persists in MongoDB")
        
        # Cleanup - delete test consultant
        requests.delete(f"{API}/admin/consultants/{test_user_id}")
    
    def test_update_consultant_name(self):
        """Test updating consultant name"""
        test_user_id = f"TEST_UPDATE_{uuid.uuid4().hex[:6]}"
        
        # First create
        requests.post(
            f"{API}/admin/consultants",
            params={"user_id": test_user_id, "name": "Original Name", "password": "Pass123"}
        )
        
        # Update name
        response = requests.put(
            f"{API}/admin/consultants/{test_user_id}",
            params={"name": "Updated Name"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✓ Consultant name updated")
        
        # Verify update
        all_consultants = requests.get(f"{API}/admin/consultants").json()
        consultant = next((c for c in all_consultants["consultants"] if c["user_id"] == test_user_id), None)
        assert consultant is not None
        assert consultant["name"] == "Updated Name"
        print(f"✓ Name change verified in MongoDB")
        
        # Cleanup
        requests.delete(f"{API}/admin/consultants/{test_user_id}")
    
    def test_update_consultant_user_id(self):
        """Test updating consultant User ID (rename)"""
        original_user_id = f"TEST_RENAME_{uuid.uuid4().hex[:6]}"
        new_user_id = f"TEST_RENAMED_{uuid.uuid4().hex[:6]}"
        
        # Create
        requests.post(
            f"{API}/admin/consultants",
            params={"user_id": original_user_id, "name": "Rename Test", "password": "Pass123"}
        )
        
        # Update User ID
        response = requests.put(
            f"{API}/admin/consultants/{original_user_id}",
            params={"new_user_id": new_user_id}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✓ Consultant User ID changed from {original_user_id} to {new_user_id}")
        
        # Verify - old ID should not exist
        all_consultants = requests.get(f"{API}/admin/consultants").json()
        old_found = any(c["user_id"] == original_user_id for c in all_consultants["consultants"])
        new_found = any(c["user_id"] == new_user_id for c in all_consultants["consultants"])
        assert not old_found, "Old User ID still exists"
        assert new_found, "New User ID not found"
        print(f"✓ User ID change verified in MongoDB")
        
        # Cleanup
        requests.delete(f"{API}/admin/consultants/{new_user_id}")
    
    def test_update_consultant_password(self):
        """Test updating consultant password"""
        test_user_id = f"TEST_PASS_{uuid.uuid4().hex[:6]}"
        
        # Create
        requests.post(
            f"{API}/admin/consultants",
            params={"user_id": test_user_id, "name": "Password Test", "password": "OldPass123"}
        )
        
        # Update password
        response = requests.put(
            f"{API}/admin/consultants/{test_user_id}",
            params={"password": "NewPass456"}
        )
        assert response.status_code == 200
        print(f"✓ Consultant password updated")
        
        # Verify new password works for login
        login_response = requests.post(
            f"{API}/consultant/login",
            params={"user_id": test_user_id, "password": "NewPass456"}
        )
        assert login_response.status_code == 200
        assert login_response.json()["success"] == True
        print(f"✓ New password verified via login")
        
        # Cleanup
        requests.delete(f"{API}/admin/consultants/{test_user_id}")
    
    def test_delete_consultant(self):
        """Test permanently deleting a consultant from MongoDB"""
        test_user_id = f"TEST_DELETE_{uuid.uuid4().hex[:6]}"
        
        # Create
        requests.post(
            f"{API}/admin/consultants",
            params={"user_id": test_user_id, "name": "Delete Test", "password": "Pass123"}
        )
        
        # Delete
        response = requests.delete(f"{API}/admin/consultants/{test_user_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✓ Consultant deleted")
        
        # Verify deletion
        all_consultants = requests.get(f"{API}/admin/consultants").json()
        found = any(c["user_id"] == test_user_id for c in all_consultants["consultants"])
        assert not found, "Deleted consultant still exists"
        print(f"✓ Permanent deletion verified in MongoDB")


class TestReportsVisibility:
    """Tests for reports visibility in Consultant and Admin panels"""
    
    def test_consultant_can_view_own_reports(self):
        """Test consultant can see their own reports in My Reports tab"""
        response = requests.get(f"{API}/consultant/reports/{CONSULTANT_ID}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "reports" in data
        assert "count" in data
        assert "consultant_name" in data
        print(f"✓ Consultant {CONSULTANT_ID} can view {data['count']} reports")
    
    def test_admin_can_view_all_consultant_reports(self):
        """Test admin can see all consultant reports in Consultant Reports tab"""
        response = requests.get(f"{API}/admin/consultant-reports")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "reports" in data
        assert "reports_by_consultant" in data
        assert "total_count" in data
        print(f"✓ Admin can view {data['total_count']} total reports from all consultants")
    
    def test_reports_grouped_by_consultant(self):
        """Test admin reports are grouped by consultant name"""
        response = requests.get(f"{API}/admin/consultant-reports")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data.get("reports_by_consultant"), dict)
        
        # If there are reports, verify structure
        if data["total_count"] > 0:
            for consultant_name, reports in data["reports_by_consultant"].items():
                assert isinstance(reports, list)
                for report in reports:
                    assert report.get("consultant_name") == consultant_name
        print(f"✓ Reports correctly grouped by {len(data['reports_by_consultant'])} consultants")


class TestConsultantPersistence:
    """Test that consultant credentials persist after server restart simulation"""
    
    def test_default_consultant_exists(self):
        """Verify default consultants are seeded in MongoDB"""
        response = requests.get(f"{API}/admin/consultants")
        assert response.status_code == 200
        data = response.json()
        
        # Check PRIYAMPATRA exists (from seed data)
        consultants = data["consultants"]
        priyam_found = any(c["user_id"] == "PRIYAMPATRA" for c in consultants)
        assert priyam_found, "Default consultant PRIYAMPATRA not found in database"
        print(f"✓ Default consultant PRIYAMPATRA exists in MongoDB (seeded)")
    
    def test_consultant_count_matches_expected(self):
        """Verify consultant count is reasonable (seeded + any added)"""
        response = requests.get(f"{API}/admin/consultants")
        assert response.status_code == 200
        data = response.json()
        
        # Should have at least 24 default consultants (from hardcoded list)
        assert data["count"] >= 24, f"Expected at least 24 consultants, got {data['count']}"
        print(f"✓ {data['count']} consultants in MongoDB (expected >= 24)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
