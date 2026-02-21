"""
Test cases for new call statistics and report auto-logging features:
1. Auto-log successful call when consultant submits a detailed report
2. Admin delete call stats endpoint with password confirmation
3. Quick log call endpoint (only for failed/attempted calls)
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://edu-advisor-preview.preview.emergentagent.com').rstrip('/')

# Test credentials
ADMIN_PASSWORD = "EDUadvisors@souvikCEO2026"
CONSULTANT_ID = "PRIYAMPATRA"
CONSULTANT_PASSWORD = "Priyam123!@#"


class TestConsultantAuthentication:
    """Test consultant login endpoint"""
    
    def test_consultant_login_success(self):
        """Test successful consultant login"""
        response = requests.post(
            f"{BASE_URL}/api/consultant/login",
            params={"user_id": CONSULTANT_ID, "password": CONSULTANT_PASSWORD}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"✓ Consultant login successful for {CONSULTANT_ID}")
    
    def test_consultant_login_invalid_credentials(self):
        """Test failed consultant login with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/consultant/login",
            params={"user_id": CONSULTANT_ID, "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Invalid credentials properly rejected")


class TestConsultantReportWithAutoLog:
    """Test that submitting a detailed report auto-logs a successful call"""
    
    def test_submit_report_auto_logs_successful_call(self):
        """
        When a consultant submits a detailed report, it should:
        1. Create the report successfully
        2. Auto-log a successful call entry
        """
        # First get current call stats
        initial_response = requests.get(f"{BASE_URL}/api/consultant/calls/{CONSULTANT_ID}")
        assert initial_response.status_code == 200
        initial_stats = initial_response.json().get("stats", {})
        initial_successful = initial_stats.get("successful_calls", 0)
        print(f"Initial successful calls: {initial_successful}")
        
        # Submit a detailed report
        report_data = {
            "student_name": "TEST_AutoLogStudent",
            "contact_number": "9876543210",
            "institution_name": "Test School",
            "competitive_exam_preference": "JEE",
            "career_interest": "Engineering",
            "college_interest": "IIT",
            "interest_scope": "ACTIVELY INTERESTED",
            "other_remarks": "Test report for auto-log verification"
        }
        
        report_response = requests.post(
            f"{BASE_URL}/api/consultant/reports",
            params={"consultant_id": CONSULTANT_ID},
            json=report_data
        )
        assert report_response.status_code == 200, f"Report submission failed: {report_response.text}"
        report_json = report_response.json()
        assert report_json.get("success") == True
        print(f"✓ Report submitted successfully with ID: {report_json.get('report_id')}")
        
        # Verify call stats increased
        updated_response = requests.get(f"{BASE_URL}/api/consultant/calls/{CONSULTANT_ID}")
        assert updated_response.status_code == 200
        updated_stats = updated_response.json().get("stats", {})
        updated_successful = updated_stats.get("successful_calls", 0)
        print(f"Updated successful calls: {updated_successful}")
        
        # Successful calls should have increased by 1
        assert updated_successful == initial_successful + 1, \
            f"Expected successful calls to increase by 1, but got {updated_successful} (was {initial_successful})"
        print("✓ Successful call auto-logged when report was submitted")


class TestQuickLogCall:
    """Test the quick log call endpoint for failed/attempted calls"""
    
    def test_log_failed_call(self):
        """Test logging a failed call"""
        response = requests.post(
            f"{BASE_URL}/api/consultant/calls",
            params={
                "consultant_id": CONSULTANT_ID,
                "call_type": "failed",
                "student_name": "TEST_FailedCallStudent",
                "contact_number": "1234567890",
                "remarks": "No answer"
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print("✓ Failed call logged successfully")
    
    def test_log_attempted_call(self):
        """Test logging an attempted call"""
        response = requests.post(
            f"{BASE_URL}/api/consultant/calls",
            params={
                "consultant_id": CONSULTANT_ID,
                "call_type": "attempted",
                "student_name": "TEST_AttemptedCallStudent",
                "contact_number": "0987654321",
                "remarks": "Will call back"
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print("✓ Attempted call logged successfully")
    
    def test_log_call_unauthorized(self):
        """Test that invalid consultant ID is rejected"""
        response = requests.post(
            f"{BASE_URL}/api/consultant/calls",
            params={
                "consultant_id": "INVALID_CONSULTANT",
                "call_type": "failed",
                "student_name": "Test",
                "contact_number": "123"
            }
        )
        assert response.status_code == 401
        print("✓ Invalid consultant properly rejected")


class TestGetCallStats:
    """Test retrieving call statistics"""
    
    def test_get_consultant_call_stats(self):
        """Test getting call stats for a specific consultant"""
        response = requests.get(f"{BASE_URL}/api/consultant/calls/{CONSULTANT_ID}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "stats" in data
        assert "total_calls" in data["stats"]
        assert "successful_calls" in data["stats"]
        assert "failed_calls" in data["stats"]
        assert "attempted_calls" in data["stats"]
        print(f"✓ Call stats retrieved: {data['stats']}")
    
    def test_get_all_call_stats_admin(self):
        """Test getting all call stats (admin view)"""
        response = requests.get(f"{BASE_URL}/api/admin/calls")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "overall_stats" in data
        assert "consultant_stats" in data
        print(f"✓ Admin call stats retrieved: {data['overall_stats']}")


class TestAdminDeleteCallStats:
    """Test admin ability to delete call statistics for a consultant"""
    
    def test_delete_calls_requires_password(self):
        """Test that delete endpoint requires valid password"""
        response = requests.delete(
            f"{BASE_URL}/api/admin/calls/{CONSULTANT_ID}",
            params={"password": "wrongpassword"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Delete rejected with wrong password")
    
    def test_delete_calls_with_correct_password(self):
        """Test successful deletion of call stats with correct password"""
        # First, ensure there are some test calls to delete by logging one
        requests.post(
            f"{BASE_URL}/api/consultant/calls",
            params={
                "consultant_id": CONSULTANT_ID,
                "call_type": "attempted",
                "student_name": "TEST_ToBeDeleted",
                "remarks": "Test call to be deleted"
            }
        )
        
        # Get current call count
        before_response = requests.get(f"{BASE_URL}/api/consultant/calls/{CONSULTANT_ID}")
        before_stats = before_response.json().get("stats", {})
        before_total = before_stats.get("total_calls", 0)
        print(f"Calls before delete: {before_total}")
        
        # Delete calls with correct password
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/calls/{CONSULTANT_ID}",
            params={"password": ADMIN_PASSWORD}
        )
        assert delete_response.status_code == 200, f"Expected 200, got {delete_response.status_code}: {delete_response.text}"
        delete_data = delete_response.json()
        assert delete_data.get("success") == True
        print(f"✓ Delete successful: {delete_data.get('message')}")
        
        # Verify calls are deleted
        after_response = requests.get(f"{BASE_URL}/api/consultant/calls/{CONSULTANT_ID}")
        after_stats = after_response.json().get("stats", {})
        after_total = after_stats.get("total_calls", 0)
        print(f"Calls after delete: {after_total}")
        
        assert after_total == 0, f"Expected 0 calls after delete, got {after_total}"
        print("✓ Call stats successfully deleted")


class TestAdminPasswordVerification:
    """Test admin password verification endpoint"""
    
    def test_verify_correct_password(self):
        """Test password verification with correct password"""
        response = requests.post(
            f"{BASE_URL}/api/admin/verify-password",
            params={"password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("✓ Correct password verified")
    
    def test_verify_wrong_password(self):
        """Test password verification with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/admin/verify-password",
            params={"password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Wrong password rejected")


class TestCleanup:
    """Cleanup test data after tests"""
    
    def test_cleanup_test_reports(self):
        """Clean up test reports created during testing"""
        # Get all reports
        response = requests.get(f"{BASE_URL}/api/admin/consultant-reports")
        if response.status_code == 200:
            data = response.json()
            reports = data.get("reports", [])
            deleted = 0
            for report in reports:
                if "TEST_" in report.get("student_name", ""):
                    del_response = requests.delete(f"{BASE_URL}/api/consultant/reports/{report['id']}")
                    if del_response.status_code == 200:
                        deleted += 1
            print(f"✓ Cleaned up {deleted} test reports")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
