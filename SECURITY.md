# Security Policy

## Supported Versions

Currently, the following versions of WalBlob are supported with security updates:

| Version | Supported |
| ------- | --------- |
| 2.1.x   | ✅        |
| 2.0.x   | ❌        |

## Threat Model

WalBlob is a client-side frontend. The security model assumes:
1. **Zero-Knowledge**: Encryption happens entirely in the browser using the Web Crypto API (AES-GCM).
2. **Key Protection**: Encryption keys are never transmitted to any server. They are handled in-memory or stored locally if explicitly requested by the user.
3. **Decentralized Storage**: Data is stored on the Walrus network. Availability depends on the network's health and the chosen storage epochs.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an e-mail to security@walblob.com (placeholder). All security vulnerabilities will be promptly addressed.

Please include:
- A description of the vulnerability.
- Steps to reproduce the issue.
- Potential impact.

We ask that you do not disclose the issue publicly until we have had a chance to address it.
