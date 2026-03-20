# node-canvas

Single-repository workspace for an algorithm-visualization site.

## Layout

```text
apps/
  web/                      Vite + React frontend
packages/
  visualization-contract/  Shared visualization protocol, schemas, and demo fixtures
services/
  api-cpp/                 Placeholder for the C++ service
  api-java/                Placeholder for the Java service
fixtures/
  visualizations/          Shared JSON examples and golden payloads
docs/
  architecture.md          Repository structure and responsibilities
```

## Commands

Run from the repository root:

```bash
npm install
npm run dev
npm run test
npm run build
```

## Why This Structure

- `apps/web` is the product surface.
- `packages/visualization-contract` is the shared source of truth for the payload format.
- `services/*` can evolve independently without forcing a second repository.
- `fixtures/visualizations` is where backend and frontend can share stable sample payloads.
