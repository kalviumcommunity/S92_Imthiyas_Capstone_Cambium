# Cambium Security Architecture & Threat Model
## `docs/security/`

This document outlines the threat modeling, cryptographic controls, access management matrices, and compliance posture governing Cambium.

### Security Framework Alignment
- **Threat Model**: STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).
- **Application Security Verification Standard**: OWASP ASVS Level 2.
- **Access Control Model**: Role-Based Access Control (RBAC) across 5 institutional roles: `Fellow`, `Researcher`, `PI`, `Compliance Officer`, `Admin`.

### Cryptographic Controls
1. **Zero-Trust Identity**: Dual-token authentication using short-lived JWT access tokens (15 minutes) and rotating cryptographically random refresh tokens (7 days) stored in `HttpOnly`, `SameSite=Lax/None`, `Secure` cookies.
2. **Cryptographic Audit Ledger**: High-entropy recursive SHA-256 hash chaining guaranteeing immutability of all compliance, data-export, and IRB actions.
3. **Institutional SSO**: Federated SAML 2.0 / InCommon protocol integration for university Single Sign-On.

### Cross-Reference Security Specifications
- [Master Security Policy](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/security.md)
- [Root Vulnerability Disclosure Policy](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/SECURITY.md)
- [RBAC Role Permission Matrix](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/audit/SECURITY_AND_RBAC_MATRIX.md)
- [Penetration Testing & Security Audit](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/audit/SECURITY_AUDIT.md)

