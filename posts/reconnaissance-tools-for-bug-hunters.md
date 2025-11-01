---
title: "Reconnaissance Tools for Bug Hunters"
date: "2024-03-20"
excerpt: "Essential tools and techniques for gathering information before you start hunting for vulnerabilities."
---

Reconnaissance, or "recon," is the foundation of successful bug bounty hunting. Before you can find vulnerabilities, you need to understand your target. Here are the tools and techniques I use during the recon phase.

## Subdomain Discovery

Finding all subdomains is often the first step. I use multiple tools to ensure comprehensive coverage:

- **Amass** - Passive subdomain enumeration
- **Sublist3r** - Fast subdomain discovery
- **Crt.sh** - Certificate transparency logs
- **Shodan** - Internet-connected device search

Running multiple tools and comparing results helps ensure you don't miss any hidden subdomains.

## Technology Stack Identification

Knowing what technologies a target uses helps you focus your efforts:

- **Wappalyzer** - Browser extension for quick tech stack identification
- **WhatWeb** - Web application fingerprinting
- **BuiltWith** - Comprehensive technology profile

Once you know they're running WordPress or a specific framework, you can search for known vulnerabilities and test accordingly.

## Directory and File Discovery

Hidden directories and files often contain sensitive information:

- **dirb** - Web content scanner
- **gobuster** - Directory brute-forcing
- **ffuf** - Fast web fuzzer

Use common wordlists like SecLists and customize them based on your findings.

## API Discovery

Modern applications rely heavily on APIs:

- **Burp Suite** - Intercept and analyze API calls
- **Postman** - Test API endpoints
- **Postman collections** - Share and document APIs

Look for exposed API endpoints, forgotten test environments, and API documentation.

## DNS and Infrastructure

Understanding the infrastructure reveals attack surfaces:

- **dig/nslookup** - DNS queries
- **whois** - Domain information
- **nmap** - Network scanning
- **Masscan** - Fast port scanner

Document all findings. Create notes on:
- Open ports and services
- SSL/TLS configurations
- Cloud providers and CDNs
- Third-party integrations

## Automation

Manual recon is important, but automation saves time:

- Create scripts to run multiple tools
- Use **reconftw** or build custom workflows
- Set up continuous monitoring for new subdomains

## Best Practices

1. **Stay within scope** - Always check program rules
2. **Rate limit** - Don't overwhelm target systems
3. **Document everything** - Good notes lead to better bugs
4. **Stay organized** - Use tools like **Obsidian** or **Notion**

Remember, recon is an ongoing process. As you find bugs and dig deeper, you'll discover new attack surfaces. The time invested in thorough reconnaissance directly correlates with successful bug discoveries.

