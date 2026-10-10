# Operations Runbook & Incident Response
## SignBridge AI Operational Troubleshooting

### 1. Incident Severity Definitions
* **SEV-1 (Critical Outage)**: Primary chat workspace unreachable or recognition inference failing globally.
* **SEV-2 (Degraded Mode)**: Video recognition degraded; audio transcription or text fallback operational.
* **SEV-3 (Non-Critical)**: Minor UI telemetry delays or non-blocking avatar preview warning.

---

### 2. Common Scenarios & Resolutions

#### Scenario A: Database Connection Pool Exhaustion
* **Symptom**: HTTP 500 on `GET /api/v1/conversations`.
* **Remediation**:
  1. Inspect PostgreSQL active connections:
     ```sql
     SELECT count(*), state FROM pg_stat_activity GROUP BY state;
     ```
  2. Scale up connection pool in `pgbouncer` or restart database container:
     ```bash
     docker compose restart db
     ```

#### Scenario B: High Inference Latency on Video Ingestion
* **Symptom**: `POST /api/v1/recognition/jobs` latency > 10s.
* **Remediation**:
  1. Check inference worker queue depth in Redis / background cluster.
  2. Scale GPU inference workers if GPU utilization > 90%.
  3. Verify client is sending videos within the 60-second limit.

#### Scenario C: Expired Media Purge Failure
* **Symptom**: Disk usage growing unexpectedly on storage volume.
* **Remediation**:
  1. Manually trigger retention purge:
     ```sql
     DELETE FROM media_assets WHERE expires_at < NOW();
     ```
  2. Verify cron scheduler is running.
