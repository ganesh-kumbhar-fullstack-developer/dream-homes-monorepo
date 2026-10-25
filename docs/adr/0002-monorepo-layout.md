# ADR 0002: Monorepo layout

- **Status:** Accepted
- **Date:** 2026-10-25

## Decision

One repository with `apps/web` and `apps/api`. Infrastructure definitions will live in `infra/`. Local development runs through `compose.yaml` and a `Makefile`.

## Why not a JavaScript workspace tool (Turborepo, Nx)

The repo has two apps in two languages. A Python app cannot use JavaScript workspace tooling in any useful way, so a Makefile and per-app tooling are simpler. Revisit if shared JavaScript packages (for example, a design system) appear.

## Consequences

- Each app keeps its own dependency file and CI job.
- Cross-app changes (such as an API field) land in one commit, which keeps contracts in sync.
