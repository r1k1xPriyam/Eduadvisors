"""
Tests for 7 new features in Edu Advisor:
1. Duplicate report handling - replace old with confirmation
2. Mandatory fields enforcement with warnings
3. Quick Log Call requires contact number
4. Detailed call stats view on Admin
5. Consultant can view own call stats
6. Next Calling Reminder feature with notifications
7. CSV bulk report upload
"""

import pytest
import requests
import os
import uuid
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
CONSULTANT_ID = "PRIYAMPATRA"
CONSULTANT_PASSWORD = "Priyam123!@#"
ADMIN_PASSWORD = "EDUadvisors@souvikCEO2026"


class TestDuplicateReportHandling:
    """Feature 1: Duplicate report handling - submit report, submit another with same phone number"""
    
    def test_first_report_submission(self):
        """Submit initial report - should succeed"""
        unique_phone = f"9999{uuid.uuid4().hex[:6]}"
        report_data = {
            "student_name": "TEST_Duplicate_Student",
            "contact_number": unique_phone,
            "institution_name": "TEST_Institution",
            "competitive_exam_preference": "JEE",
            "career_interest": "Engineering",
            "interest_scope": "ACTIVELY INTERESTED"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}",
            json=report_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True or data.get("duplicate") == True
        
        # Store phone for next test
        self.unique_phone = unique_phone
        print(f"First report submitted with phone: {unique_phone}")
        return unique_phone

    def test_duplicate_report_detection(self):
        """Submit second report with same phone - should detect duplicate"""
        # First create a report
        unique_phone = f"9888{uuid.uuid4().hex[:6]}"
        report_data = {
            "student_name": "TEST_First_Student",
            "contact_number": unique_phone,
            "institution_name": "TEST_School",
            "competitive_exam_preference": "NEET",
            "career_interest": "Medical",
            "interest_scope": "ACTIVELY INTERESTED"
        }
        
        # Submit first report
        response1 = requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}",
            json=report_data
        )
        assert response1.status_code == 200
        
        # Submit second report with same phone number
        report_data2 = {
            "student_name": "TEST_Second_Student_Same_Phone",
            "contact_number": unique_phone,
            "institution_name": "TEST_College",
            "competitive_exam_preference": "JEE",
            "career_interest": "Engineering",
            "interest_scope": "LESS INTERESTED"
        }
        
        response2 = requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}",
            json=report_data2
        )
        
        assert response2.status_code == 200
        data = response2.json()
        # Should detect duplicate
        assert data.get("duplicate") == True
        assert "existing_report_id" in data
        print(f"Duplicate detected for phone: {unique_phone}")

    def test_duplicate_update_existing(self):
        """Update existing report when duplicate is confirmed"""
        unique_phone = f"9777{uuid.uuid4().hex[:6]}"
        
        # Create first report
        report_data1 = {
            "student_name": "TEST_Original_Student",
            "contact_number": unique_phone,
            "institution_name": "TEST_Original_School",
            "competitive_exam_preference": "WBJEE",
            "career_interest": "Engineering",
            "interest_scope": "ACTIVELY INTERESTED"
        }
        
        response1 = requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}",
            json=report_data1
        )
        assert response1.status_code == 200
        
        # Update with same phone and update_existing=true
        report_data2 = {
            "student_name": "TEST_Updated_Student",
            "contact_number": unique_phone,
            "institution_name": "TEST_Updated_School",
            "competitive_exam_preference": "JEE",
            "career_interest": "Computer Science",
            "interest_scope": "LESS INTERESTED"
        }
        
        response2 = requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}&update_existing=true",
            json=report_data2
        )
        
        assert response2.status_code == 200
        data = response2.json()
        assert data.get("success") == True
        print(f"Report updated for phone: {unique_phone}")

    def test_check_duplicate_endpoint(self):
        """Test check duplicate endpoint directly"""
        # First create a report
        unique_phone = f"9666{uuid.uuid4().hex[:6]}"
        report_data = {
            "student_name": "TEST_Check_Student",
            "contact_number": unique_phone,
            "institution_name": "TEST_Institution",
            "competitive_exam_preference": "NEET",
            "career_interest": "Medical",
            "interest_scope": "ACTIVELY INTERESTED"
        }
        
        requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}",
            json=report_data
        )
        
        # Check for duplicate
        response = requests.get(
            f"{BASE_URL}/api/consultant/reports/check-duplicate",
            params={"consultant_id": CONSULTANT_ID, "contact_number": unique_phone}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("exists") == True
        assert "student_name" in data
        print(f"Duplicate check working for phone: {unique_phone}")


class TestQuickLogCallContactRequired:
    """Feature 3: Quick Log Call requires contact number"""
    
    def test_quick_call_without_contact_fails(self):
        """Quick log call without contact number should fail"""
        response = requests.post(
            f"{BASE_URL}/api/consultant/calls",
            params={
                "consultant_id": CONSULTANT_ID,
                "call_type": "failed",
                "student_name": "Test Student",
                "contact_number": "",  # Empty contact
                "remarks": "Test call"
            }
        )
        
        assert response.status_code == 400
        data = response.json()
        assert "contact number" in data.get("detail", "").lower()
        print("Quick call without contact correctly rejected")

    def test_quick_call_with_na_contact_fails(self):
        """Quick log call with N/A contact should fail"""
        response = requests.post(
            f"{BASE_URL}/api/consultant/calls",
            params={
                "consultant_id": CONSULTANT_ID,
                "call_type": "attempted",
                "student_name": "Test Student",
                "contact_number": "N/A",
                "remarks": "Test call"
            }
        )
        
        assert response.status_code == 400
        print("Quick call with N/A contact correctly rejected")

    def test_quick_call_with_contact_succeeds(self):
        """Quick log call with valid contact number should succeed"""
        response = requests.post(
            f"{BASE_URL}/api/consultant/calls",
            params={
                "consultant_id": CONSULTANT_ID,
                "call_type": "failed",
                "student_name": "TEST_Call_Student",
                "contact_number": f"9555{uuid.uuid4().hex[:6]}",
                "remarks": "Test failed call"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("Quick call with contact number succeeded")

    def test_quick_call_attempted_with_contact(self):
        """Log attempted call with valid contact"""
        response = requests.post(
            f"{BASE_URL}/api/consultant/calls",
            params={
                "consultant_id": CONSULTANT_ID,
                "call_type": "attempted",
                "student_name": "TEST_Attempted_Student",
                "contact_number": f"9444{uuid.uuid4().hex[:6]}",
                "remarks": "No answer"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("Attempted call logged successfully")


class TestDetailedCallStatsAdmin:
    """Feature 4: Detailed call stats view on Admin"""
    
    def test_admin_call_details_endpoint(self):
        """Admin can fetch detailed call list"""
        response = requests.get(f"{BASE_URL}/api/admin/calls/details")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "calls" in data
        assert "count" in data
        print(f"Admin call details: {data.get('count')} calls found")

    def test_admin_call_details_filter_by_consultant(self):
        """Admin can filter call details by consultant"""
        response = requests.get(
            f"{BASE_URL}/api/admin/calls/details",
            params={"consultant_id": CONSULTANT_ID}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        # All calls should be from this consultant
        for call in data.get("calls", []):
            assert call.get("consultant_id") == CONSULTANT_ID
        print(f"Filtered calls for {CONSULTANT_ID}: {data.get('count')} calls")

    def test_admin_call_details_filter_by_type(self):
        """Admin can filter call details by call type"""
        response = requests.get(
            f"{BASE_URL}/api/admin/calls/details",
            params={"call_type": "successful"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        # All calls should be successful
        for call in data.get("calls", []):
            assert call.get("call_type") == "successful"
        print(f"Successful calls: {data.get('count')}")

    def test_admin_overall_call_stats(self):
        """Admin can view overall call stats"""
        response = requests.get(f"{BASE_URL}/api/admin/calls")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "overall_stats" in data
        assert "consultant_stats" in data
        
        stats = data.get("overall_stats", {})
        assert "total_calls" in stats
        assert "successful_calls" in stats
        assert "failed_calls" in stats
        print(f"Overall stats: Total={stats.get('total_calls')}, Success={stats.get('successful_calls')}")


class TestConsultantCallStats:
    """Feature 5: Consultant can view own call stats"""
    
    def test_consultant_call_stats(self):
        """Consultant can get their own call stats"""
        response = requests.get(f"{BASE_URL}/api/consultant/calls/{CONSULTANT_ID}")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "stats" in data
        assert "calls" in data
        
        stats = data.get("stats", {})
        assert "total_calls" in stats
        assert "successful_calls" in stats
        assert "failed_calls" in stats
        assert "attempted_calls" in stats
        print(f"Consultant {CONSULTANT_ID} stats: {stats}")

    def test_consultant_call_details(self):
        """Consultant can get detailed call list"""
        response = requests.get(f"{BASE_URL}/api/consultant/calls/details/{CONSULTANT_ID}")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "calls" in data
        assert "count" in data
        print(f"Consultant call details: {data.get('count')} calls")

    def test_consultant_call_details_filter_by_type(self):
        """Consultant can filter own calls by type"""
        response = requests.get(
            f"{BASE_URL}/api/consultant/calls/details/{CONSULTANT_ID}",
            params={"call_type": "failed"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        # All calls should be failed type
        for call in data.get("calls", []):
            assert call.get("call_type") == "failed"
        print(f"Filtered failed calls: {data.get('count')}")


class TestNextCallingReminder:
    """Feature 6: Next Calling Reminder feature with notifications"""
    
    def test_submit_report_with_reminder(self):
        """Submit report with next_followup_date"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        unique_phone = f"9333{uuid.uuid4().hex[:6]}"
        
        report_data = {
            "student_name": "TEST_Reminder_Student",
            "contact_number": unique_phone,
            "institution_name": "TEST_Reminder_School",
            "competitive_exam_preference": "JEE",
            "career_interest": "Engineering",
            "interest_scope": "ACTIVELY INTERESTED",
            "next_followup_date": tomorrow
        }
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}",
            json=report_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"Report with reminder for {tomorrow} created")

    def test_consultant_reminders_endpoint(self):
        """Consultant can fetch their reminders"""
        response = requests.get(f"{BASE_URL}/api/consultant/reminders/{CONSULTANT_ID}")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "today_reminders" in data
        assert "upcoming_reminders" in data
        assert "overdue_reminders" in data
        assert "total_pending" in data
        print(f"Consultant reminders: Today={len(data.get('today_reminders', []))}, Upcoming={len(data.get('upcoming_reminders', []))}, Overdue={len(data.get('overdue_reminders', []))}")

    def test_admin_all_reminders(self):
        """Admin can view all reminders"""
        response = requests.get(f"{BASE_URL}/api/admin/reminders")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "today_reminders" in data
        assert "upcoming_reminders" in data
        assert "overdue_reminders" in data
        print(f"Admin reminders: Total pending={data.get('total_pending', 0)}")

    def test_mark_reminder_complete(self):
        """Mark a reminder as complete"""
        # First create a report with a reminder
        today = datetime.now().strftime("%Y-%m-%d")
        unique_phone = f"9222{uuid.uuid4().hex[:6]}"
        
        report_data = {
            "student_name": "TEST_Complete_Reminder",
            "contact_number": unique_phone,
            "institution_name": "TEST_Complete_School",
            "competitive_exam_preference": "NEET",
            "career_interest": "Medical",
            "interest_scope": "LESS INTERESTED",
            "next_followup_date": today
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}",
            json=report_data
        )
        assert create_response.status_code == 200
        
        create_data = create_response.json()
        if create_data.get("success"):
            report_id = create_data.get("report_id")
            
            # Mark as complete
            complete_response = requests.put(
                f"{BASE_URL}/api/consultant/reminders/{report_id}/complete",
                params={"consultant_id": CONSULTANT_ID}
            )
            
            assert complete_response.status_code == 200
            complete_data = complete_response.json()
            assert complete_data.get("success") == True
            print(f"Reminder {report_id} marked as complete")


class TestCSVBulkUpload:
    """Feature 7: CSV bulk report upload"""
    
    def test_get_sample_csv_format(self):
        """Get sample CSV format"""
        response = requests.get(f"{BASE_URL}/api/consultant/sample-csv")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "headers" in data
        assert "sample_data" in data
        assert "interest_scope_options" in data
        
        headers = data.get("headers", [])
        expected_headers = ["student_name", "contact_number", "institution_name", 
                          "competitive_exam_preference", "career_interest", "college_interest",
                          "interest_scope", "next_followup_date", "other_remarks"]
        
        for header in expected_headers:
            assert header in headers
        print(f"Sample CSV headers: {headers}")

    def test_bulk_upload_valid_reports(self):
        """Upload valid bulk reports"""
        reports = [
            {
                "student_name": "TEST_Bulk_Student_1",
                "contact_number": f"9111{uuid.uuid4().hex[:6]}",
                "institution_name": "TEST_Bulk_School_1",
                "competitive_exam_preference": "JEE",
                "career_interest": "Engineering",
                "college_interest": "IIT",
                "interest_scope": "ACTIVELY INTERESTED",
                "next_followup_date": "",
                "other_remarks": "From bulk upload test"
            },
            {
                "student_name": "TEST_Bulk_Student_2",
                "contact_number": f"9112{uuid.uuid4().hex[:6]}",
                "institution_name": "TEST_Bulk_School_2",
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
            json=reports
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert data.get("success_count") == 2
        print(f"Bulk upload: {data.get('success_count')} reports uploaded")

    def test_bulk_upload_with_errors(self):
        """Upload bulk reports with some invalid entries"""
        reports = [
            {
                "student_name": "TEST_Valid_Student",
                "contact_number": f"9113{uuid.uuid4().hex[:6]}",
                "institution_name": "TEST_Valid_School",
                "competitive_exam_preference": "JEE",
                "career_interest": "Engineering",
                "interest_scope": "ACTIVELY INTERESTED"
            },
            {
                # Missing required fields
                "student_name": "",
                "contact_number": "",
                "institution_name": "",
                "competitive_exam_preference": "",
                "career_interest": "",
                "interest_scope": ""
            }
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/bulk-reports?consultant_id={CONSULTANT_ID}",
            json=reports
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert data.get("success_count") == 1
        assert data.get("error_count") >= 1
        assert len(data.get("errors", [])) >= 1
        print(f"Bulk upload with errors: success={data.get('success_count')}, errors={data.get('error_count')}")

    def test_bulk_upload_invalid_interest_scope(self):
        """Upload with invalid interest_scope value"""
        reports = [
            {
                "student_name": "TEST_Invalid_Scope",
                "contact_number": f"9114{uuid.uuid4().hex[:6]}",
                "institution_name": "TEST_School",
                "competitive_exam_preference": "JEE",
                "career_interest": "Engineering",
                "interest_scope": "INVALID_SCOPE_VALUE"  # Invalid value
            }
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/bulk-reports?consultant_id={CONSULTANT_ID}",
            json=reports
        )
        
        assert response.status_code == 200
        data = response.json()
        # Should have error for invalid interest_scope
        assert data.get("error_count") >= 1
        print(f"Invalid interest_scope correctly rejected")


class TestMandatoryFieldsValidation:
    """Feature 2: Mandatory fields enforcement - Backend validation"""
    
    def test_missing_student_name_fails(self):
        """Report without student_name should fail"""
        report_data = {
            "contact_number": f"9000{uuid.uuid4().hex[:6]}",
            "institution_name": "TEST_School",
            "competitive_exam_preference": "JEE",
            "career_interest": "Engineering",
            "interest_scope": "ACTIVELY INTERESTED"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}",
            json=report_data
        )
        
        # Should return 422 for validation error
        assert response.status_code in [400, 422]
        print("Missing student_name correctly rejected")

    def test_report_with_all_mandatory_fields_succeeds(self):
        """Report with all mandatory fields should succeed"""
        report_data = {
            "student_name": "TEST_All_Fields",
            "contact_number": f"9001{uuid.uuid4().hex[:6]}",
            "institution_name": "TEST_Complete_School",
            "competitive_exam_preference": "JEE",
            "career_interest": "Engineering",
            "interest_scope": "ACTIVELY INTERESTED"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/consultant/reports?consultant_id={CONSULTANT_ID}",
            json=report_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True or data.get("duplicate") == True
        print("Report with all mandatory fields accepted")


class TestCleanup:
    """Clean up test data"""
    
    def test_cleanup_test_reports(self):
        """Clean up TEST_ prefixed reports"""
        # Get consultant reports
        response = requests.get(f"{BASE_URL}/api/consultant/reports/{CONSULTANT_ID}")
        if response.status_code == 200:
            data = response.json()
            reports = data.get("reports", [])
            
            deleted_count = 0
            for report in reports:
                if report.get("student_name", "").startswith("TEST_"):
                    delete_response = requests.delete(
                        f"{BASE_URL}/api/consultant/reports/{report.get('id')}"
                    )
                    if delete_response.status_code == 200:
                        deleted_count += 1
            
            print(f"Cleaned up {deleted_count} test reports")
        else:
            print("Could not fetch reports for cleanup")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
