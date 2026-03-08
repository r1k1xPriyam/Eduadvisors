"""
Test suite for Bulk Report Upload feature in Edu Advisor app.
Tests for:
- POST /api/consultant/bulk-reports - Bulk upload via CSV/spreadsheet
- GET /api/consultant/sample-csv - Sample CSV template download
- Validation of required fields in bulk upload
- Auto-creation of call logs for bulk uploaded reports
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
CONSULTANT_ID = "PRIYAMPATRA"


class TestSampleCSVEndpoint:
    """Test sample CSV download endpoint"""

    def test_get_sample_csv_returns_correct_headers(self):
        """Test GET /api/consultant/sample-csv - should return all expected headers"""
        response = requests.get(f"{BASE_URL}/api/consultant/sample-csv")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "headers" in data
        assert "sample_data" in data
        assert "interest_scope_options" in data
        
        expected_headers = [
            "student_name", "contact_number", "institution_name",
            "competitive_exam_preference", "career_interest", "college_interest",
            "interest_scope", "next_followup_date", "other_remarks"
        ]
        
        for header in expected_headers:
            assert header in data["headers"], f"Missing header: {header}"
        
        print(f"Sample CSV headers: {data['headers']}")

    def test_sample_csv_has_interest_scope_options(self):
        """Test that sample CSV includes valid interest scope options"""
        response = requests.get(f"{BASE_URL}/api/consultant/sample-csv")
        data = response.json()
        
        expected_options = [
            "ACTIVELY INTERESTED", "LESS INTERESTED", "RECALLING NEEDED",
            "DROPOUT THIS YEAR", "ALREADY COLLEGE SELECTED", "NOT INTERESTED"
        ]
        
        for option in expected_options:
            assert option in data["interest_scope_options"], f"Missing interest scope option: {option}"
        
        print(f"Interest scope options: {data['interest_scope_options']}")


class TestBulkReportsEndpoint:
    """Test bulk reports upload endpoint"""

    def test_bulk_upload_success(self):
        """Test POST /api/consultant/bulk-reports - successful bulk upload"""
        unique_id = str(uuid.uuid4())[:6]
        test_reports = [
            {
                "student_name": f"TEST_BulkSuccess1_{unique_id}",
                "contact_number": f"98765{unique_id[:5]}01",
                "institution_name": "Test Institution A",
                "competitive_exam_preference": "JEE",
                "career_interest": "Engineering",
                "college_interest": "IIT Delhi",
                "interest_scope": "ACTIVELY INTERESTED",
                "next_followup_date": "2026-02-15",
                "other_remarks": "Test bulk upload"
            },
            {
                "student_name": f"TEST_BulkSuccess2_{unique_id}",
                "contact_number": f"98765{unique_id[:5]}02",
                "institution_name": "Test Institution B",
                "competitive_exam_preference": "NEET",
                "career_interest": "Medical",
                "college_interest": "",
                "interest_scope": "LESS INTERESTED",
                "next_followup_date": "",
                "other_remarks": ""
            }
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/bulk-reports?consultant_id={CONSULTANT_ID}",
            json=test_reports
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") is True
        assert data.get("success_count") == 2, f"Expected 2 successful uploads, got {data.get('success_count')}"
        assert data.get("error_count") == 0
        
        print(f"Bulk upload success: {data['success_count']} reports")

    def test_bulk_upload_missing_required_fields(self):
        """Test bulk upload with missing required fields shows errors"""
        test_reports = [
            {
                "student_name": "",  # Missing required
                "contact_number": "9876543210",
                "institution_name": "Test School",
                "competitive_exam_preference": "JEE",
                "career_interest": "Engineering",
                "interest_scope": "ACTIVELY INTERESTED"
            }
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/bulk-reports?consultant_id={CONSULTANT_ID}",
            json=test_reports
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") is True
        assert data.get("success_count") == 0
        assert data.get("error_count") == 1
        assert len(data.get("errors", [])) == 1
        assert "student_name" in data["errors"][0].lower() or "missing" in data["errors"][0].lower()
        
        print(f"Missing field error: {data['errors']}")

    def test_bulk_upload_invalid_interest_scope(self):
        """Test bulk upload with invalid interest scope value"""
        unique_id = str(uuid.uuid4())[:6]
        test_reports = [
            {
                "student_name": f"TEST_InvalidScope_{unique_id}",
                "contact_number": f"98765{unique_id[:5]}03",
                "institution_name": "Test School",
                "competitive_exam_preference": "JEE",
                "career_interest": "Engineering",
                "college_interest": "",
                "interest_scope": "INVALID_VALUE",  # Invalid
                "other_remarks": ""
            }
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/bulk-reports?consultant_id={CONSULTANT_ID}",
            json=test_reports
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success_count") == 0
        assert data.get("error_count") == 1
        assert "interest_scope" in data["errors"][0].lower()
        
        print(f"Invalid interest scope error: {data['errors']}")

    def test_bulk_upload_unauthorized_consultant(self):
        """Test bulk upload with invalid consultant_id returns 401"""
        test_reports = [
            {
                "student_name": "Test Student",
                "contact_number": "9876543210",
                "institution_name": "Test School",
                "competitive_exam_preference": "JEE",
                "career_interest": "Engineering",
                "interest_scope": "ACTIVELY INTERESTED"
            }
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/bulk-reports?consultant_id=INVALID_CONSULTANT",
            json=test_reports
        )
        
        assert response.status_code == 401, f"Expected 401 for invalid consultant, got {response.status_code}"
        print("Unauthorized consultant correctly rejected")


class TestBulkUploadCallLogCreation:
    """Test that bulk upload auto-creates call logs"""

    def test_bulk_upload_creates_call_logs(self):
        """Test that bulk upload creates successful call log entries"""
        # Get initial call count
        initial_response = requests.get(f"{BASE_URL}/api/consultant/calls/{CONSULTANT_ID}")
        initial_data = initial_response.json()
        initial_successful = initial_data["stats"]["successful_calls"]
        
        # Upload one report
        unique_id = str(uuid.uuid4())[:6]
        test_reports = [
            {
                "student_name": f"TEST_CallLog_{unique_id}",
                "contact_number": f"98765{unique_id[:5]}04",
                "institution_name": "Test School CallLog",
                "competitive_exam_preference": "JEE",
                "career_interest": "Engineering",
                "college_interest": "",
                "interest_scope": "ACTIVELY INTERESTED",
                "other_remarks": "Testing call log creation"
            }
        ]
        
        upload_response = requests.post(
            f"{BASE_URL}/api/consultant/bulk-reports?consultant_id={CONSULTANT_ID}",
            json=test_reports
        )
        assert upload_response.json().get("success_count") == 1
        
        # Verify call count increased by 1
        final_response = requests.get(f"{BASE_URL}/api/consultant/calls/{CONSULTANT_ID}")
        final_data = final_response.json()
        final_successful = final_data["stats"]["successful_calls"]
        
        assert final_successful == initial_successful + 1, \
            f"Expected successful calls to increase by 1, was {initial_successful}, now {final_successful}"
        
        print(f"Call logs created: {initial_successful} -> {final_successful}")


class TestAnalyticsEndpoints:
    """Test Admin and Consultant Analytics endpoints"""

    def test_admin_analytics_overview(self):
        """Test GET /api/admin/analytics/overview"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/overview")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") is True
        assert "overview" in data
        
        overview = data["overview"]
        required_fields = ["total_reports", "total_calls", "total_admissions", "total_queries"]
        for field in required_fields:
            assert field in overview, f"Missing field: {field}"
        
        print(f"Admin overview: {overview}")

    def test_admin_call_distribution(self):
        """Test GET /api/admin/analytics/call-distribution"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/call-distribution")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") is True
        assert "distribution" in data
        
        distribution = data["distribution"]
        names = [d["name"] for d in distribution]
        assert "Successful" in names
        assert "Failed" in names
        assert "Attempted" in names
        
        print(f"Call distribution: {distribution}")

    def test_admin_interest_scope_distribution(self):
        """Test GET /api/admin/analytics/interest-scope"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/interest-scope")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") is True
        assert "distribution" in data
        
        print(f"Interest scope distribution count: {len(data['distribution'])}")

    def test_admin_reports_trend(self):
        """Test GET /api/admin/analytics/reports-trend - 14 days"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/reports-trend")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") is True
        assert "trend" in data
        assert len(data["trend"]) == 14, f"Expected 14 days, got {len(data['trend'])}"
        
        print(f"Reports trend: {len(data['trend'])} days")

    def test_admin_consultant_performance(self):
        """Test GET /api/admin/analytics/consultant-performance"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/consultant-performance")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") is True
        assert "performance" in data
        
        print(f"Consultant performance: {len(data['performance'])} consultants")

    def test_admin_monthly_admissions(self):
        """Test GET /api/admin/analytics/monthly-admissions - 6 months"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/monthly-admissions")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") is True
        assert "monthly" in data
        assert len(data["monthly"]) == 6, f"Expected 6 months, got {len(data['monthly'])}"
        
        print(f"Monthly admissions: {data['monthly']}")

    def test_consultant_analytics_overview(self):
        """Test GET /api/consultant/analytics/overview/{consultant_id}"""
        response = requests.get(f"{BASE_URL}/api/consultant/analytics/overview/{CONSULTANT_ID}")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") is True
        assert "overview" in data
        
        overview = data["overview"]
        required_fields = ["total_reports", "total_calls", "today_reports", "week_reports"]
        for field in required_fields:
            assert field in overview, f"Missing field: {field}"
        
        print(f"Consultant overview: {overview}")

    def test_consultant_call_distribution(self):
        """Test GET /api/consultant/analytics/call-distribution/{consultant_id}"""
        response = requests.get(f"{BASE_URL}/api/consultant/analytics/call-distribution/{CONSULTANT_ID}")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") is True
        assert "distribution" in data
        
        print(f"Consultant call distribution: {data['distribution']}")

    def test_consultant_daily_calls(self):
        """Test GET /api/consultant/analytics/daily-calls/{consultant_id}"""
        response = requests.get(f"{BASE_URL}/api/consultant/analytics/daily-calls/{CONSULTANT_ID}")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("success") is True
        assert "trend" in data
        assert len(data["trend"]) == 14
        
        # Each day should have successful, failed, attempted
        for day in data["trend"]:
            assert "successful" in day
            assert "failed" in day
            assert "attempted" in day
        
        print(f"Consultant daily calls: {len(data['trend'])} days")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
