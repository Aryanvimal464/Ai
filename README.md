# 🤖 AI-Powered QA Testing Platform

An end-to-end **QA Automation Testing Platform** built using **Python, Selenium, Flask, REST API Testing, HTML, CSS, and JavaScript**.

The project demonstrates practical QA automation by combining **web UI testing, functional testing, API testing, negative testing, responsive testing, screenshots, and automated test execution** in one project.

---

## 📌 Project Overview

The AI-Powered QA Testing Platform is designed to demonstrate different software testing and QA automation concepts in a single application.

The project currently includes:

* Selenium Web UI Automation
* Functional Testing
* REST API Testing
* CRUD API Validation
* Negative API Testing
* Responsive UI Testing
* JavaScript Error Validation
* Automated Screenshots
* Combined Test Execution
* PASS/FAIL Test Reporting

---

## 🛠️ Technologies Used

| Technology         | Purpose                            |
| ------------------ | ---------------------------------- |
| Python             | Automation and backend development |
| Selenium WebDriver | Web UI automation                  |
| Flask              | Backend REST APIs                  |
| Flask-CORS         | Frontend/backend communication     |
| Requests           | REST API automation                |
| HTML5              | Frontend structure                 |
| CSS3               | User interface styling             |
| JavaScript         | Frontend functionality             |
| Git                | Version control                    |
| GitHub             | Project hosting                    |

---

## 📂 Project Structure

```text
AI-QA-Testing-Platform/
│
├── assets/
├── Backend/
│   ├── app.py
│   ├── selenium_test.py
│   ├── api_test.py
│   ├── run_all_tests.py
│   └── screenshots/
│       └── full_test.png
│
├── reports/
├── test-data/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

# 🌐 Selenium UI Automation

The project contains an automated Selenium test suite for validating the web application.

### Automated UI Test Scenarios

1. Website Load Test
2. Page Title Validation
3. Button Detection
4. Input Field Validation
5. Link Validation
6. Navigation Validation
7. Heading Validation
8. JavaScript Error Check
9. Desktop Responsive View
10. Tablet Responsive View
11. Mobile Responsive View
12. Browser Automation Navigation Test
13. Screenshot Capture

### Current Selenium Result

```text
Total Tests : 13
Passed      : 13
Failed      : 0
Status      : PASS
```

---

# 🔌 REST API Testing

A Flask backend is included to demonstrate REST API development and automated API testing.

### Available APIs

```text
GET     /api/health
POST    /api/run-full-suite

POST    /api/testcases
GET     /api/testcases
PUT     /api/testcases/<id>
DELETE  /api/testcases/<id>
```

### Automated API Test Scenarios

1. Health API Validation
2. HTTP Status Code Validation
3. API Response Time Validation
4. Create Test Case — POST
5. Get Test Cases — GET
6. Update Test Case — PUT
7. Delete Test Case — DELETE
8. Missing Required Field Validation
9. Invalid Test Case ID Validation
10. Invalid Endpoint Validation

### Current API Automation Result

```text
Total Tests : 9
Passed      : 9
Failed      : 0
Status      : PASS
```

---

# 🧪 Negative Testing

The project also validates invalid and unexpected inputs.

Examples include:

* Missing required fields
* Invalid test case IDs
* Invalid API endpoints
* HTTP error status validation
* UI and navigation validation

This helps ensure the application handles incorrect inputs safely and predictably.

---

# 📱 Responsive Testing

Selenium automatically changes the browser viewport to test the application on multiple screen sizes.

The test suite currently validates:

* Desktop View
* Tablet View
* Mobile View

---

# 📸 Screenshot Testing

The automation framework captures screenshots during execution.

Example output:

```text
Backend/screenshots/full_test.png
```

Screenshots can be used as execution evidence and for debugging failed tests.

---

# ▶️ How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/Aryanvimal464/AI-QA-Testing-Platform.git
```

Move into the project:

```bash
cd AI-QA-Testing-Platform
```

---

## 2. Install Python Dependencies

```bash
pip install selenium flask flask-cors requests
```

---

## 3. Start the Web Application

From the main project directory:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/index.html
```

---

## 4. Start the Flask Backend

Open another terminal:

```bash
cd Backend
python app.py
```

Backend runs at:

```text
http://127.0.0.1:5000
```

Health endpoint:

```text
http://127.0.0.1:5000/api/health
```

---

# 🧪 Run Selenium Tests

From the `Backend` directory:

```bash
python selenium_test.py
```

Expected result:

```text
Total  : 13
Passed : 13
Failed : 0
Status : PASS
```

---

# 🔌 Run API Tests

Keep the Flask backend running and open another terminal.

```bash
cd Backend
python api_test.py
```

Expected result:

```text
Total  : 9
Passed : 9
Failed : 0
Status : PASS
```

---

# 🚀 Run Complete QA Automation Suite

To execute Selenium and API automation together:

```bash
cd Backend
python run_all_tests.py
```

The combined runner executes:

```text
Selenium UI Automation
        +
REST API Automation
        ↓
Final QA Report
```

With the current suites, this represents **22 automated checks** when both suites complete successfully.

---

# 🎯 Testing Concepts Demonstrated

This project demonstrates practical knowledge of:

* Software Testing
* QA Automation
* Selenium WebDriver
* Functional Testing
* UI Testing
* API Testing
* REST API Validation
* CRUD Testing
* Negative Testing
* Responsive Testing
* HTTP Status Code Validation
* Response Time Validation
* Test Execution
* Screenshot Capture
* Defect Investigation
* SDLC
* STLC

---

# 🚧 Future Improvements

Future versions of the project can include:

* Pytest Framework Integration
* Page Object Model (POM)
* Data-Driven Testing
* Automated HTML Reports
* Allure Reports
* Database Testing
* Authentication/API Security Testing
* CI/CD with GitHub Actions
* Cross-Browser Testing
* Performance Testing
* Mobile Application Testing
* AI-assisted Test Case Generation

---

# 💼 Resume Description

**AI-Powered QA Testing Platform**

Developed an end-to-end QA automation project using **Python, Selenium WebDriver, Flask, and REST APIs**. Implemented automated web UI checks, functional navigation testing, CRUD API automation, negative testing, responsive validation, screenshot capture, response-time validation, and combined automated test execution.

---

## 👤 Author

**Aryan Vimal**

GitHub: [Aryanvimal464](https://github.com/Aryanvimal464)

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

