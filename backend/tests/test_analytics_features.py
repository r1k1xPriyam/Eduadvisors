"""
Test suite for Admin and Consultant Analytics endpoints in Edu Advisor app.
Tests for:
- Admin Analytics: overview, call-distribution, interest-scope, reports-trend, consultant-performance, monthly-admissions
- Consultant Analytics: overview, call-distribution, interest-scope, reports-trend, daily-calls
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_USER_ID = "ADMIN"
ADMIN_PASSWORD = "EDUadvisors@souvikCEO2026"
CONSULTANT_ID = "PRIYAMPATRA"
CONSULTANT_PASSWORD = "Priyam123!@#"


class TestAdminAnalyticsEndpoints:
    """Test Admin Analytics API endpoints"""

    def test_admin_analytics_overview(self):
        """Test GET /api/admin/analytics/overview - should return 4 overview metrics"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/overview")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("success") is True, "API should return success=True"
        assert "overview" in data, "Response should contain 'overview' key"
        
        overview = data["overview"]
        # Verify all 4 required fields exist
        assert "total_reports" in overview, "Should have total_reports"
        assert "total_calls" in overview, "Should have total_calls"
        assert "total_admissions" in overview, "Should have total_admissions"
        assert "total_queries" in overview, "Should have total_queries"
        
        # Additional fields check
        assert "today_reports" in overview, "Should have today_reports"
        assert "today_calls" in overview, "Should have today_calls"
        assert "week_reports" in overview, "Should have week_reports"
        assert "month_admissions" in overview, "Should have month_admissions"
        
        print(f"Admin Overview: Reports={overview['total_reports']}, Calls={overview['total_calls']}, Admissions={overview['total_admissions']}, Queries={overview['total_queries']}")

    def test_admin_call_distribution(self):
        """Test GET /api/admin/analytics/call-distribution - should return pie chart data"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/call-distribution")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "distribution" in data
        
        distribution = data["distribution"]
        assert isinstance(distribution, list), "Distribution should be a list"
        
        # Should have 3 categories: Successful, Failed, Attempted
        names = [d["name"] for d in distribution]
        assert "Successful" in names, "Should have Successful category"
        assert "Failed" in names, "Should have Failed category"
        assert "Attempted" in names, "Should have Attempted category"
        
        # Each item should have name, value, color
        for item in distribution:
            assert "name" in item
            assert "value" in item
            assert "color" in item
            assert isinstance(item["value"], int), "Value should be integer"
        
        print(f"Admin Call Distribution: {distribution}")

    def test_admin_interest_scope_distribution(self):
        """Test GET /api/admin/analytics/interest-scope - should return student interest pie chart data"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/interest-scope")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "distribution" in data
        
        distribution = data["distribution"]
        assert isinstance(distribution, list), "Distribution should be a list"
        
        # Each item should have name, value, color
        for item in distribution:
            assert "name" in item
            assert "value" in item
            assert "color" in item
        
        print(f"Admin Interest Scope Distribution: {len(distribution)} categories")

    def test_admin_reports_trend(self):
        """Test GET /api/admin/analytics/reports-trend - should return 14-day trend data"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/reports-trend")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "trend" in data
        
        trend = data["trend"]
        assert isinstance(trend, list), "Trend should be a list"
        assert len(trend) == 14, f"Should have 14 days of data, got {len(trend)}"
        
        # Each item should have date and reports count
        for item in trend:
            assert "date" in item, "Each trend item should have date"
            assert "reports" in item, "Each trend item should have reports count"
        
        print(f"Admin Reports Trend: {len(trend)} days")

    def test_admin_consultant_performance(self):
        """Test GET /api/admin/analytics/consultant-performance - should return bar chart data"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/consultant-performance")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "performance" in data
        
        performance = data["performance"]
        assert isinstance(performance, list), "Performance should be a list"
        
        # Each item should have name, fullName, reports, calls
        for item in performance:
            assert "name" in item, "Each performance item should have name"
            assert "fullName" in item, "Each performance item should have fullName"
            assert "reports" in item, "Each performance item should have reports count"
            assert "calls" in item, "Each performance item should have calls count"
        
        print(f"Admin Consultant Performance: {len(performance)} consultants")

    def test_admin_monthly_admissions(self):
        """Test GET /api/admin/analytics/monthly-admissions - should return 6-month bar chart data"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/monthly-admissions")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "monthly" in data
        
        monthly = data["monthly"]
        assert isinstance(monthly, list), "Monthly should be a list"
        assert len(monthly) == 6, f"Should have 6 months of data, got {len(monthly)}"
        
        # Each item should have month and admissions count
        for item in monthly:
            assert "month" in item, "Each monthly item should have month"
            assert "admissions" in item, "Each monthly item should have admissions count"
        
        print(f"Admin Monthly Admissions: {monthly}")


class TestConsultantAnalyticsEndpoints:
    """Test Consultant Analytics API endpoints"""

    def test_consultant_analytics_overview(self):
        """Test GET /api/consultant/analytics/overview/{consultant_id} - should return 3 overview metrics"""
        response = requests.get(f"{BASE_URL}/api/consultant/analytics/overview/{CONSULTANT_ID}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("success") is True, "API should return success=True"
        assert "overview" in data, "Response should contain 'overview' key"
        
        overview = data["overview"]
        # Verify required fields for consultant overview
        assert "total_reports" in overview, "Should have total_reports"
        assert "total_calls" in overview, "Should have total_calls"
        assert "week_reports" in overview, "Should have week_reports (This Week)"
        assert "today_reports" in overview, "Should have today_reports"
        assert "today_calls" in overview, "Should have today_calls"
        
        print(f"Consultant Overview: Reports={overview['total_reports']}, Calls={overview['total_calls']}, Week={overview['week_reports']}")

    def test_consultant_analytics_overview_unauthorized(self):
        """Test GET /api/consultant/analytics/overview with invalid consultant_id"""
        response = requests.get(f"{BASE_URL}/api/consultant/analytics/overview/INVALID_USER")
        assert response.status_code == 401, f"Expected 401 for invalid user, got {response.status_code}"
        
        print("Unauthorized access correctly rejected")

    def test_consultant_call_distribution(self):
        """Test GET /api/consultant/analytics/call-distribution/{consultant_id}"""
        response = requests.get(f"{BASE_URL}/api/consultant/analytics/call-distribution/{CONSULTANT_ID}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "distribution" in data
        
        distribution = data["distribution"]
        assert isinstance(distribution, list), "Distribution should be a list"
        
        # Should have 3 categories: Successful, Failed, Attempted
        names = [d["name"] for d in distribution]
        assert "Successful" in names, "Should have Successful category"
        assert "Failed" in names, "Should have Failed category"
        assert "Attempted" in names, "Should have Attempted category"
        
        print(f"Consultant Call Distribution: {distribution}")

    def test_consultant_interest_scope(self):
        """Test GET /api/consultant/analytics/interest-scope/{consultant_id}"""
        response = requests.get(f"{BASE_URL}/api/consultant/analytics/interest-scope/{CONSULTANT_ID}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "distribution" in data
        
        distribution = data["distribution"]
        assert isinstance(distribution, list), "Distribution should be a list"
        
        print(f"Consultant Interest Scope: {len(distribution)} categories")

    def test_consultant_reports_trend(self):
        """Test GET /api/consultant/analytics/reports-trend/{consultant_id}"""
        response = requests.get(f"{BASE_URL}/api/consultant/analytics/reports-trend/{CONSULTANT_ID}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "trend" in data
        
        trend = data["trend"]
        assert isinstance(trend, list), "Trend should be a list"
        assert len(trend) == 14, f"Should have 14 days of data, got {len(trend)}"
        
        for item in trend:
            assert "date" in item
            assert "reports" in item
        
        print(f"Consultant Reports Trend: {len(trend)} days")

    def test_consultant_daily_calls(self):
        """Test GET /api/consultant/analytics/daily-calls/{consultant_id}"""
        response = requests.get(f"{BASE_URL}/api/consultant/analytics/daily-calls/{CONSULTANT_ID}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "trend" in data
        
        trend = data["trend"]
        assert isinstance(trend, list), "Trend should be a list"
        assert len(trend) == 14, f"Should have 14 days of data, got {len(trend)}"
        
        # Each day should have successful, failed, attempted counts
        for item in trend:
            assert "date" in item
            assert "successful" in item
            assert "failed" in item
            assert "attempted" in item
        
        print(f"Consultant Daily Calls: {len(trend)} days")


class TestCSVBulkUploadWarningBanner:
    """Test CSV Bulk Upload sample CSV endpoint"""

    def test_sample_csv_endpoint(self):
        """Test GET /api/consultant/sample-csv - endpoint for CSV format info"""
        response = requests.get(f"{BASE_URL}/api/consultant/sample-csv")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") is True
        assert "headers" in data
        assert "sample_data" in data
        assert "interest_scope_options" in data
        
        # Verify expected headers
        expected_headers = [
            "student_name", "contact_number", "institution_name",
            "competitive_exam_preference", "career_interest", "college_interest",
            "interest_scope", "next_followup_date", "other_remarks"
        ]
        for header in expected_headers:
            assert header in data["headers"], f"Missing header: {header}"
        
        print(f"Sample CSV Headers: {data['headers']}")
        print(f"Interest Scope Options: {data['interest_scope_options']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
