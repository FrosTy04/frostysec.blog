---
title: "Top 5 Web Vulnerabilities Explained Simply"
date: "2024-03-25"
excerpt: "A beginner-friendly explanation of the most common web application vulnerabilities and how they work."
---

Understanding common vulnerabilities is essential for bug bounty hunters. Here's a simple explanation of the top 5 web vulnerabilities you'll encounter.

## 1. Cross-Site Scripting (XSS)

XSS occurs when an application includes untrusted data in a web page without proper validation or escaping.

**Types:**
- **Reflected XSS**: The malicious script is reflected off a web server, like in search results
- **Stored XSS**: The malicious script is permanently stored on the server
- **DOM-based XSS**: The vulnerability exists in client-side code

**Example:**
```javascript
// User input: <script>alert('XSS')</script>
// Application displays it without sanitization
<div>{userInput}</div> // Dangerous!
```

**How to test:**
Inject simple payloads like `<script>alert(1)</script>` or `<img src=x onerror=alert(1)>` into input fields.

## 2. SQL Injection

SQL injection happens when user input is directly concatenated into SQL queries without proper sanitization.

**Example:**
```sql
-- User input: admin' OR '1'='1
-- Vulnerable query:
SELECT * FROM users WHERE username = '$input'
-- Becomes:
SELECT * FROM users WHERE username = 'admin' OR '1'='1'
-- This bypasses authentication!
```

**How to test:**
Try payloads like `' OR '1'='1`, `' UNION SELECT null--`, or use tools like **SQLMap**.

## 3. Cross-Site Request Forgery (CSRF)

CSRF tricks a user into performing actions they didn't intend to perform on a website where they're authenticated.

**Example:**
An attacker creates a malicious website with an image tag:
```html
<img src="https://victim-site.com/transfer?amount=1000&to=attacker">
```

If the user is logged in, this request executes automatically using their session.

**How to test:**
Create a form or link that submits a request to the target site and see if it executes without proper CSRF tokens.

## 4. Authentication Bypass

Authentication vulnerabilities allow attackers to gain unauthorized access to systems.

**Common issues:**
- Weak password policies
- Brute force vulnerabilities
- Session fixation
- Password reset flaws
- OAuth misconfigurations

**How to test:**
- Try default credentials (admin/admin, admin/password)
- Test password reset functionality
- Check for username enumeration
- Look for exposed authentication endpoints

## 5. Server-Side Request Forgery (SSRF)

SSRF vulnerabilities allow an attacker to make the server send requests to unintended locations.

**Example:**
A web application fetches a URL provided by the user:
```
User input: http://localhost/admin
Application makes request to: http://localhost/admin
```

This could expose internal services or perform actions on behalf of the server.

**How to test:**
- Use URLs like `http://localhost`, `http://127.0.0.1`, or `http://169.254.169.254` (AWS metadata)
- Try different protocols: `file://`, `gopher://`, `dict://`
- Use IP encoding to bypass filters

## General Testing Tips

1. **Use Burp Suite** to intercept and modify requests
2. **Start simple** - try basic payloads first
3. **Read documentation** - Understand how features work
4. **Think like an attacker** - What would break this?
5. **Automate repetitive tasks** - Use scripts for mass testing

## Learning Resources

- OWASP Top 10
- PortSwigger Web Security Academy
- HackerOne Hacktivity reports
- Bug bounty write-ups on Medium

Remember, finding vulnerabilities requires patience and practice. Start with one vulnerability type, master it, then move to the next. Happy hunting!

