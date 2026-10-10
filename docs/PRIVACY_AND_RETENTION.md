# Privacy & Data Retention Architecture
## SignBridge AI Data Minimization and Ephemeral Policy

### 1. Classification of User Data

| Data Type | Sensitivity | Retention Period | Storage Location | Purge Mechanism |
|---|---|---|---|---|
| **Raw Sign Language Video** | High (Biometric / Visual) | Max 48 Hours | Private S3 / Object Store | S3 Lifecycle Policy & Cron Auto-Purge |
| **Pose Keypoints / Landmarks** | Medium | Ephemeral (Session duration) | In-Memory Model Buffer | Purged immediately on inference completion |
| **Audio Microphone Recordings** | High (Voice Biometric) | Ephemeral (Immediate) | Temporary memory buffer | Purged immediately after transcription |
| **Conversation Messages** | Low-Medium | User-controlled | PostgreSQL DB (Encrypted at rest) | Deleted on user request or account purge |
| **User Profile Metadata** | Low | Account lifetime | PostgreSQL DB | Deleted on account deletion |

---

### 2. Ephemeral Media Purge Mechanism
SignBridge enforces a maximum 48-hour retention on raw video assets:
1. When a video is uploaded via `POST /api/v1/media/uploads`, an `expires_at` timestamp is set to `NOW() + INTERVAL '48 HOURS'`.
2. A scheduled cron worker queries `DELETE FROM media_assets WHERE expires_at < NOW()`.
3. Object storage lifecycle rules automatically prune underlying blobs.

---

### 3. User Data Rights & GDPR / CCPA Compliance
* **Right to Access / Export**: Users can trigger an instant JSON export of all conversations and recognition metadata via the Settings modal.
* **Right to Erasure**: Users can click "Purge Conversation History" or delete specific chats to instantly remove all corresponding database records and associated media references.
* **No Default Model Training**: User gesture videos are never utilized to retrain foundation models without explicit opt-in agreements.
