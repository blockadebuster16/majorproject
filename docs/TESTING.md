# Automated Testing Strategy & Execution
## SignBridge AI Test Suite

### 1. Test Strategy Overview
Our testing strategy encompasses unit tests, integration tests, end-to-end journey checks, and security verification.

```
                   /\
                  /  \   End-to-End User Journeys (Playwright / Browser Subagent)
                 /----\
                /      \   Integration Tests (API Endpoints, Server DB Isolation)
               /--------\
              /          \  Unit Tests (Model Adapters, State Transitions, Utilities)
             --------------
```

---

### 2. Executing Automated Tests
The repository is equipped with an automated test suite executed via Node.js native test runner:

```bash
# Run full automated test suite
npm test
```

### 3. Test Coverage Breakdown

#### Unit & Adapter Tests (`tests/adapters.test.mjs`)
1. **Sign Language Recognizer**:
   - Verifies `DevSignLanguageRecognizer` produces calibrated confidence scores between 0.8 and 1.0.
   - Asserts generation of temporal gloss segments with timestamps.
   - Tests multi-sign language routing (ASL, BSL, ISL, Auslan, LSF, DGS).
   - Validates keypoint detection flags (`hands: true`, `face: true`).
2. **Audio Transcription Provider**:
   - Tests transcription generation, duration handling, and confidence output.
3. **Conversational LLM Provider**:
   - Tests contextual responses for general queries and recognized sign language reviews.
   - Asserts progressive token streaming cadence.
4. **Future Avatar Provider Contract**:
   - Validates job state machine transitions (`queued` ➔ `processing` ➔ `completed`).
   - Asserts job querying by ID.
5. **Server Database Service**:
   - Asserts conversation creation, renaming, and deletion.
   - Tests message sequencing and user isolation (ensuring User B cannot query User A's data).

---

### 4. Continuous Integration
All tests execute automatically in GitHub Actions (`.github/workflows/ci.yml`) on every pull request and push to `main`.
