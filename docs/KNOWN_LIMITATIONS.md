# Known Limitations & Boundaries
## SignBridge AI Technical & Linguistic Boundaries

### 1. Linguistic Scope & Accuracy
* **Supported Languages**: The current model adapter targets American Sign Language (`ASL`), British Sign Language (`BSL`), and Irish Sign Language (`ISL`). It does NOT support every global sign language.
* **Non-Manual Features**: While facial expressions and head nods are incorporated into phrasing, subtle micro-expressions may have reduced confidence under low camera resolution (< 720p).
* **Continuous vs Isolated Gestures**: Rapid continuous signing with fingerspelling may require users to slow gestures slightly for optimal keypoint extraction.

---

### 2. Physical & Environmental Constraints
* **Illumination**: Insufficient contrast between hands and background will trigger model confidence warnings.
* **Occlusion**: Gestures where hands cross or overlap heavily with torso or clothing of the same color can experience momentary tracking jitter.
* **Field of View**: Hands, shoulders, and face must remain within the camera bounding box throughout gesture execution.

---

### 3. Future AI Avatar Status
* **Architectural Status**: Full frontend trigger, backend API (`/api/v1/avatar/jobs`), database schema, and `AvatarProvider` contract are implemented and verified.
* **Actual 3D Avatar Generation**: The proprietary 3D animation generation model is developed and hosted independently. SignBridge returns a verified demonstration and integration contract state without falsely claiming proprietary avatar ownership.

---

### 4. Regulatory & Safety Disclaimer
* **Non-Certification**: SignBridge AI is an assistive communication bridge and is **not certified for safety-critical emergency medical or courtroom legal interpretation**. Certified human interpreters must be engaged for official legal or medical proceedings.
