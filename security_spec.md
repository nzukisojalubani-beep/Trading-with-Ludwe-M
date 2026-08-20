# Security Specification: Trading with Ludwe M Firestore Security Rules

## 1. Data Invariants
1. **User Isolation**: A user can only access, create, read, update, and delete their own user profile, bookmarks, trade journals, and learning progress records (`request.auth.uid == userId`).
2. **Identity Integrity**: All documents under `/users/{userId}/...` must have `incoming().userId == request.auth.uid`.
3. **Strict Validation Helper Enforcement**: All writes (creates and updates) must satisfy the corresponding schema validator (`isValidUserProfile`, `isValidBookmark`, `isValidJournalEntry`, `isValidUserProgress`).
4. **Denial-of-Wallet & ID Poisoning Prevention**: All document path IDs must pass `isValidId()`, and field sizes must be bounded (`size() <= MAX`).
5. **No Unauthenticated Reads or Blanket Queries**: Non-owners cannot read or list another user's trading journal, bookmarks, or progress.
6. **Immutable Fields**: `userId` and `createdAt` must remain immutable on updates.

## 2. The Dirty Dozen Payloads (Designed to be Rejected)
1. **Ghost Field Attack on Profile**: Injecting an unauthorized `isAdmin: true` or `role: "admin"` into `/users/{userId}`.
2. **ID Spoofing on Bookmark**: Creating a bookmark with `userId: "victim123"` while authenticated as `attacker456`.
3. **Unauthenticated List Query on Trade Journals**: Querying `/users/{userId}/journal` without being authenticated.
4. **Foreign Document Deletion**: Authenticated user trying to delete `/users/{otherUser}/bookmarks/{bookmarkId}`.
5. **Oversized String Payload in Journal Notes**: Writing a 500KB string payload into `notes` to attack database storage limits.
6. **Path Traversal / Poisoned ID**: Attempting to write to `/users/{userId}/journal/../../../secret`.
7. **Invalid Trade Direction Enum**: Writing `direction: "HOLD_FOREVER"` instead of `"BUY" | "SELL"`.
8. **Negative Price Value Poisoning**: Writing `entryPrice: -1.240` in a trade log.
9. **Tampering with Immutable Creation Timestamp**: Updating `createdAt` on an existing trade journal entry.
10. **State Shortcutting on Read**: Trying to query all users' progress stats with a collectionGroup query without owner equality.
11. **Malicious Empty Object**: Sending an empty `{}` object to create a profile without required keys.
12. **Array Flooding on Completed Articles**: Sending an array with 1,000,000 elements in `completedArticles`.
