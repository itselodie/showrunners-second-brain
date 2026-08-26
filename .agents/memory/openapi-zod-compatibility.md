---
name: OpenAPI and Zod compatibility
description: Compatibility constraint discovered when extending the generated API contract in this workspace
---

When adding numeric fields to the OpenAPI contract, prefer `type: number` with explicit bounds when the generated Zod package is v3; integer fields may be emitted as `z.int()`, which is not available in that runtime.

**Why:** The current Orval generation path can pair newer integer output with the workspace's Zod v3 dependency, causing library typechecking to fail after an otherwise successful codegen run.

**How to apply:** Check the generated Zod output after contract changes and use bounded numbers for values such as confidence scores when strict integer typing is not essential.