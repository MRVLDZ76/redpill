# Ontoligent — End-to-End User Experience (Signup → Resolution)

> Companion to [ONTOLIGENT_EVALUATION.md](ONTOLIGENT_EVALUATION.md) and
> [copilotOntoligent.md](copilotOntoligent.md). This is the *experiential*
> spec: what a real user sees and does, from creating an account to getting a
> closed-loop result — in sequence, with one fully worked example.
> Everything described here maps to a real BE endpoint + FE surface (no
> decorative steps). Where a step depends on a not-yet-shipped phase, it's
> tagged `[Phase N]`.

---

## 1. The journey in one line

```text
Signup → Workspace → Architect Copilot interview → Generated blueprint
→ Review & Deploy → Connect data → Pipeline runs → Knowledge Graph built
→ Ask / Agent reasons → Proposed Action → Human approves → Action executed
→ Governance shows lineage, cost, confidence → Feedback improves the system
```

The user never has to know "I need GraphRAG + ACORD + Neo4j + entity
resolution." They describe a business problem; Ontoligent designs the
architecture and the user approves it.

---

## 2. The 12 stages

| # | Stage | What the user does | What the platform does | Surface |
|---|---|---|---|---|
| 1 | **Signup** | Email + password / SSO | Provision tenant schema (django-tenants), seed workspace | `Signup.tsx` |
| 2 | **Workspace** | Name it, pick privacy mode (`byo_llm`/managed) | Create `Workspace`, set `privacy_mode`, default tools | `Workspaces.tsx` |
| 3 | **Architect Copilot** `[Phase 8]` | Answer 6 interview questions | Recommendation engine designs the architecture | `Studio.tsx` |
| 4 | **Review blueprint** `[Phase 8]` | Inspect & edit generated stack/ontology/DAG/agents/governance | Render editable blueprint | `Studio.tsx` |
| 5 | **Deploy** `[Phase 8]` | Click "Deploy" | Materialize real rows: ontology, pipeline, retrieval profile, agent, governance policy, eval set | all modules |
| 6 | **Models & Keys** | Add BYOK provider key (optional) | Encrypt (Fernet), resolve at call time | `WorkspaceSettings.tsx` |
| 7 | **Connect data** | Connector wizard / upload | DataSource + secret, `sync` enqueues Celery | `Catalog.tsx` |
| 8 | **Pipeline runs** | Watch the DAG | `parser → chunk → embed → extract.entities → resolve → graph.writer → validate.shacl → enrich → persist` | `Pipelines.tsx` |
| 9 | **Knowledge built** | See entities/edges, SHACL status | pgvector + Neo4j + Oxigraph populated; language-agnostic normalization `[Phase 7]` | `Ontology.tsx` |
| 10 | **Ask / Agent** | Ask a question | Retrieval router picks strategy `[Phase 3]`; agent reasons (planner→executor→reviewer) `[Phase 4]` | `Retrieval.tsx` / `Agents.tsx` |
| 11 | **Action + approval** `[Phase 5]` | Approve / reject proposed action | Dry-run preview → execute on external system → external id + lineage | `Actions.tsx` |
| 12 | **Govern & improve** | Review lineage/cost/confidence; thumbs-down | Audit + budget enforcement `[Phase 1]`; feedback → ontology proposal `[Phase 7]` | `Governance.tsx` |

---

## 3. Worked example — "Claims triage" (insurance), end to end

A claims operations lead at an insurer signs up. They do **not** know what
ontology or retrieval strategy they need. Watch the whole flow resolve.

### Stage 1–2 — Signup & workspace
```text
[ Sign up ]  ops.lead@acme-insure.example
[ Workspace name ]  ACME Claims
[ Privacy mode ]  ( ) Managed   (•) Bring-your-own LLM key
→ Tenant "acme" provisioned. Workspace "ACME Claims" ready.
```

### Stage 3 — Architect Copilot interview `[Phase 8]`
The Copilot asks 6 questions (no jargon):
```text
Industry?              → Insurance
Primary objective?     → Claims Automation
Primary data sources?  → PDF (claim forms) + Audio (call recordings)
Data volume?           → Medium
Real-time needs?       → Near real time
Explainability?        → Regulated
```

### Stage 4 — Generated blueprint (Copilot output)
```text
RECOMMENDED ARCHITECTURE  ─────────────────────────────
Ontology            ACORD (insurance standard) + SHACL shapes
Knowledge Graph     Yes (Neo4j)
Retrieval           GraphRAG  (relationships matter; "claims linked to broker")
Vector RAG          Secondary (policy-wording lookup)
Entity Resolution   REQUIRED  (same claimant across form + call)
Normalization       Language-agnostic concept mapping (any dialect/accent)
Agents              Planner → Retriever → Claims Domain → Action
Human Approval      REQUIRED  (regulated)
Governance          PII redaction · ABAC · Lineage · Audit · Retention
Evaluation          Golden set + faithfulness + regression suite (auto-seeded)

GENERATED DAG  ────────────────────────────────────────
ingest → parser.auto → chunk.text → normalize.concept → embed.gateway
       → extract.entities(ACORD) → enrich.resolve → graph.writer
       → validate.shacl → enrich.iri/taxonomy → persist.document
```
The user reviews, tweaks one thing (adds a "fraud-signal" entity type), and:

### Stage 5 — Deploy
```text
[ Deploy blueprint ]
✓ OntologyVersion (ACORD subset) created + published
✓ Pipeline "claims-triage" created from generated DAG
✓ RetrievalProfile "claims-graphrag" created
✓ AgentDefinition "claims-triage-agent" created (4-agent topology)
✓ Governance policy: PII redaction + approval gate enabled
✓ Eval set "claims-golden-v1" seeded
```
Everything above is a **real row**, runnable immediately.

### Stage 6–7 — Keys & data
```text
Settings → Models & Keys → + OpenAI key (sk-…)  [encrypted, write-only]
Catalog → Connect → "Upload"  → 200 claim PDFs + 50 call .wav files
        → Run sync  → Celery job queued
```

### Stage 8 — Pipeline runs (live DAG drawer)
```text
parser.auto         ✓ 250 docs parsed (PDF + audio→transcript)
chunk.text          ✓ 4,120 chunks
normalize.concept   ✓ accent/dialect variants → ACORD concepts   [Phase 7]
embed.gateway       ✓ 4,120 vectors → pgvector
extract.entities    ✓ 1,890 entities (Claim, Policy, Claimant, Broker…)
enrich.resolve      ✓ 1,890 → 1,204 canonical (686 duplicates merged)  [Phase 2]
graph.writer        ✓ Neo4j: 1,204 nodes / 3,450 edges
validate.shacl      ✓ 12 warnings, 0 blocks
persist.document    ✓ done
```

### Stage 9–10 — Ask, with auto-routed retrieval + agent reasoning
```text
User: "Which open claims are linked to broker B-204 and show fraud signals?"

Router  [Phase 3]:  relationship + multi-hop → GraphRAG (not vector)
Agent   [Phase 4]:  Planner → Retriever (3-hop graph) → Claims Domain → ...
Answer:
  3 open claims (C-1187, C-1192, C-1205) connect to broker B-204.
  C-1205 shows a fraud signal (duplicate claimant identity merged from a call
  transcript + a form under two spellings → resolved to one Claimant).
  [ lineage: document → chunk → entity → answer ]   confidence: 0.86
```

### Stage 11 — Proposed action + human approval `[Phase 5]`
```text
Agent proposes:  "Open fraud-review ticket for C-1205 and flag broker B-204"

Actions queue:
  ┌ PROPOSED ────────────────────────────────────────┐
  │ Action: create_ticket (Jira)                      │
  │ Dry-run preview:                                  │
  │   project=FRAUD  summary="Review C-1205 / B-204"  │
  │   links=[C-1205, B-204]                            │
  │ ABAC: ✓ allowed   Idempotency-key: c1205-b204     │
  └───────────────────────────────────────────────────┘
  [ Approve ]   [ Reject ]

User clicks Approve →
  ✓ Executed. External id FRAUD-3391 created.
  ✓ Lineage: decision → action → FRAUD-3391
  ✓ Audit event emitted.
```

### Stage 12 — Govern & improve
```text
Governance:
  Cost      $0.42 this run (OpenAI, 38k tokens)   [budget cap: $50/day OK]  [Phase 1]
  Lineage   document → chunk → entity → answer → action → FRAUD-3391
  Confidence retrieval 0.88 · ontology 0.91 · source 0.80 · composite 0.86
  Audit     8 events (sync, run, query, propose, approve, execute)

User thumbs-down a wrong entity →
  Feedback → ontology proposal: "add alias 'co-insured' to Claimant"  [Phase 7]
  → reviewable in Ontology; once accepted, future runs improve.
```

**Resolution:** the operations lead went from *"I need to reduce claims
processing time"* to a deployed, governed, closed-loop system that found a
fraud signal, opened a real ticket after human approval, and got smarter from
feedback — without ever choosing a database, an ontology format, or a retrieval
strategy by hand.

---

## 4. Experience principles (hold these across all phases)

1. **Describe the problem, not the architecture.** The Copilot owns the
   technical decisions; the user approves.
2. **Nothing decorative.** Every button hits a real endpoint; every number is
   real (cost, confidence, counts).
3. **Human-in-the-loop where it counts.** Actions and entity merges are
   proposed, previewed (dry-run), and approved — never silently executed.
4. **Explainable by default.** Every answer and action carries lineage,
   confidence, and audit. Regulated users can trace any output to its source.
5. **Language-agnostic.** Any dialect/language/transcription variant resolves
   to the same concept before embedding — no per-language code paths.
6. **Improves itself.** Feedback becomes ontology proposals; evals gate
   promotion so the system never silently regresses.
