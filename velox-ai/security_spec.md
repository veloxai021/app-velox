# Firestore Security Specification

This document outlines the security invariants, "Dirty Dozen" malicious payloads, and testing criteria for Velox AI's Firestore security rules.

## 1. Data Invariants

1. **User Ownership**: A user document (`/users/{userId}`) can only be created, read, updated, or deleted by the authenticated user whose `request.auth.uid == userId`.
2. **Subcollection Isolation**: Subcollection logs (`/users/{userId}/logs/{logId}`) inherit access rights directly from their parent user document. A user can only access their own logs.
3. **Credit Verification**: Users cannot self-allocate or arbitrarily increase credits beyond their plan's limits during an update.
4. **Verified Identities**: All critical write actions require that `request.auth.token.email_verified == true`.
5. **Immutable Identity**: Once created, `uid`, `email`, and `createdAt` are locked and immutable.
6. **No Shadow Fields**: Document structures must match our validated schemas with no injected malicious settings.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads represent test cases designed to violate security policies and must return `PERMISSION_DENIED`:

### Payload 1: Accessing Another User's Profile
Attempt to read `/users/stolenUserId` using credentials for `authUserId` (violates user ownership).

### Payload 2: Accessing Another User's Logs
Attempt to read `/users/stolenUserId/logs/log123` (violates subcollection isolation).

### Payload 3: Infiltrating Unauthorized Logs
Attempt to write to `/users/anotherUser/logs/log123` (violates subcollection isolation).

### Payload 4: Spoofing User Role/Plan (Privilege Escalation)
Attempt to write `isAdmin: true` or manually upgrade plan without payment from client side.

### Payload 5: Shadow Field Injection
Injected field `hasSpecialAdminPrivileges: true` to bypass verification checks.

### Payload 6: Spoofing Owner ID
Setting `uid` to a different user in `/users/{myUserId}` payload to hijack another account.

### Payload 7: Tampering with Credits
Attempt to update `credits` directly to `1000` from the client.

### Payload 8: Corrupting Timestamps
Attempt to write future or outdated `createdAt` values instead of relying on `request.time`.

### Payload 9: Invalid/Poisoned ID
Injected ID string consisting of 2KB path traversal sequences like `../../hack`.

### Payload 10: Unverified Email Access
Attempt to write data when `request.auth.token.email_verified` is `false`.

### Payload 11: Spoofed Log Category
Written a log with invalid style parameters ("HyperOusado" instead of valid StyleType).

### Payload 12: Terminal State Tampering
Changing historic state values in terminal log docs.

---

## 3. Test Runner Definition (`firestore.rules.test.ts`)

Verifies that all 12 scenario payloads are intercepted and denied securely by our Firestore rules engine.
