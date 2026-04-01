# Lab 00-A — Testing Fundamentals

![CI](https://github.com/filipewdev/lab-00a-testing-fundamentals/actions/workflows/ci.yml/badge.svg)
[![Coverage](https://img.shields.io/badge/coverage-89%25-brightgreen)](#tests)

> Test-first TypeScript utilities for Brazilian document and address validation,
> with mocked HTTP integration tests and CI coverage enforcement.

---

## What I Built

A TypeScript utility library (`@filipewdev/br-utils`) that validates and formats Brazilian documents and addresses — CPF, CNPJ, and CEP. The library exposes pure functions that can be used in any Node.js project. CEP lookups are backed by BrasilAPI and ViaCEP, with HTTP calls fully mocked in tests so the suite runs offline and deterministically.

## Architecture
```
@filipewdev/br-utils
│
├── src/
│   ├── cpf.ts       → validate, format, unformat
│   ├── cnpj.ts      → validate, format, unformat
│   ├── cep.ts       → validate, format, unformat, lookup (BrasilAPI)
│   ├── currency.ts  → formatBRL, parseBRL
│   └── date.ts      → formatRelativeDate, isBusinessDay
│
├── tests/
│   ├── unit/        → pure logic, no I/O
│   └── integration/ → mocked HTTP via vi.spyOn(globalThis, 'fetch')
│
└── GitHub Actions CI
    tsc --noEmit → eslint → vitest --coverage (≥85%)
```

## Running Locally
```bash
# Prerequisites: Node.js 20+, npm

# Install dependencies
npm install

# Typecheck
npx tsc --noEmit

# Lint
npx eslint .

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode during development
npm run test:watch
```

## Key Concepts Learned

### > Scoped vs unscoped npm packages

The only real difference is the namespace prefix — `@filipewdev/br-utils` is scoped, `br-utils` is not. 

Scoping prevents naming on the global npm registry, which matters when publishing a library anyone could install. 

The practical gotcha: scoped packages publish as private by default, so you need `--access public` or `"publishConfig": { "access": "public" }` in `package.json` to make them publicly installable.


### > tsconfig.json is not just boilerplate

Frameworks generate it for you so it's easy to ignore, but each field has real consequences.

 - `strict: true` enables a family of type checks that catch entire classes of bugs. 
 - `noUncheckedIndexedAccess` makes array access return `T | undefined` instead of silently the index exists. 
 - `NodeNext` module resolution enforces explicit file extensions in imports. 
 - For a library, `declaration: true` is non-negotiable — without it, TypeScript consumers of your package get no type information at all.

The community-maintained bases at [tsconfig/bases](https://github.com/tsconfig/bases) are a good reference for sensible starting points per runtime.


### > Test-first changes how you design APIs

Writing tests before the implementation forces you to think about the public interface — what the function receives, what it returns, what it throws — before you think about how it works internally. 

For a validation library this is particularly valuable: the test cases become the specification for every edge case (empty strings, wrong check digits, all-same-digit CPFs) before a single line of implementation exists.


### > Vitest essentials

Everything comes from one import: `describe`, `it`, `expect`, `beforeEach`, `vi`.

 - `describe` groups related cases, `it` defines a single case, `expect` with matchers (`toBe`, `toEqual`, `toThrow`, `toMatchObject`) asserts the outcome.
 - `vi.spyOn(globalThis, 'fetch')` replaces the real HTTP call with a controlled fake — this is what makes integration tests fast and offline-capable.
 - `vi.useFakeTimers()` / `vi.setSystemTime()` freezes time for deterministic date-related tests.
 - Test Filtering (`.todo`, `.fails`, `.skipIf`) controls execution per test.
 - Test Tags (defined in `vitest.config.ts`) are named categories with shared config like `timeout`.
 - Annotations are per-test metadata for reporting only.


### > `vi.spyOn` vs `vi.fn` + `vi.stubGlobal`

Both can mock `fetch`, but they work differently:

 - `vi.stubGlobal('fetch', vi.fn())` **replaces** `fetch` entirely with a brand new mock function. The original is gone until you call `vi.unstubAllGlobals()`.
 - `vi.spyOn(globalThis, 'fetch')` **wraps** the existing `fetch`. You can track calls, override the implementation, and restore the original with `mockRestore()`. It also gives better type inference because `spyOn` knows the original function signature.

Use `vi.spyOn` when you're intercepting a method that already exists on an object (like `fetch` on `globalThis`). Use `vi.fn()` when you need a standalone mock with no real implementation behind it (like a callback you pass to a function under test).


### > Why HTTP calls must be mocked in tests

When `lookupCEP` is called in production, it reaches BrasilAPI over the internet. If I called the real API in my tests, each call would add 100-500ms, fail during CI if BrasilAPI is down, and produce non-deterministic results if the API changes its response format. More importantly, I'm not testing BrasilAPI — I'm testing *my* code's behaviour when given a successful response, a 404, or a network error. Mocking `fetch` lets me simulate all those cases deterministically and offline.


### > The difference between unit tests and integration tests

The tests in `tests/unit/` test one function in complete isolation — no I/O, no network, no shared state. The tests in `tests/integration/` test `lookupCEP` with a mocked `fetch` to verify that my code constructs the right URL, handles API responses correctly, and maps the data into the expected shape. A *true* integration test would call the real BrasilAPI and assert the response format hasn't changed — those are valuable but belong in a separate suite that doesn't run in CI by default, since they're slow, flaky, and depend on external availability.


### > Why CPFs with all identical digits fail

`111.111.111-11` passes the check digit algorithm mathematically. The Receita Federal added an explicit rule excluding these because they're obviously fake — no legitimate CPF would have all digits the same. This is a reminder that validation algorithms have two layers: mathematical correctness and business rules. The business rules must be encoded explicitly; the algorithm alone isn't enough.


### > `it.each` for parameterized tests

When many tests share the exact same assertion structure and only differ in input/output, `it.each` reduces boilerplate and makes adding new edge cases a one-liner. For example, validation tests (`expect(validateCPF(x)).toBe(true/false)`) are a perfect fit. Format/unformat tests, where expected outputs vary per case and values are reused across `describe` blocks, work better with a shared data object. Both patterns can be mixed in the same file — the choice depends on whether the test body is uniform or not.


### > JSDoc as a first-class deliverable

For a reusable library, JSDoc on every exported function is not optional documentation — it's part of the API surface. When a consumer `import { formatCPF }` in another project, the IDE shows the JSDoc inline: what the function does, what it returns on invalid input, and a usage example. This is more immediately useful than any README for day-to-day consumption, and it costs almost nothing to maintain since it lives next to the code it describes.

### > CI pipeline structure with GitHub Actions

The TypeScript CI pipeline runs three gates in order: `tsc --noEmit` catches
type errors without producing output files, `eslint` enforces code style and
security rules, and `vitest run --coverage` validates behaviour and enforces
the coverage threshold. If any gate fails, the pipeline stops — a type error
never reaches the test runner, and a lint error never reaches deployment.

### > Why test across multiple Node versions

Running the same suite on Node 20.x, 22.x, and 24.x catches API differences
between runtimes — a function available in Node 22 might not exist in Node 20.
For a utility library that consumers will run on different versions, this is
the only way to guarantee compatibility without relying on assumptions about
the consumer's environment.

### > Conditional steps in GitHub Actions

GitHub Actions has no native `else` — the idiomatic pattern is two steps with
mirrored conditions using `if: matrix.node-version == '24.x'` and
`if: matrix.node-version != '24.x'`. Coverage reporting runs only on the
latest Node version to avoid posting duplicate reports from every matrix
entry. All other versions run the test suite without coverage, which still
validates correctness across runtimes.

### > Coverage metrics are not all equal

Four metrics exist: statements (individual operations executed), lines
(physical lines executed), branches (both sides of every `if`/ternary/`&&`
exercised), and functions (each function called at least once). For a
validation library, branches is the most meaningful — it forces you to test
both the valid and invalid path through every condition. 100% functions with
low branch coverage means every function was called but many edge cases were
never exercised.

## Tests

**Strategy**: test-first (TDD). All test files were written before the implementation. Each utility module has a corresponding unit test file that covers valid inputs, invalid inputs, and edge cases (empty strings, whitespace, wrong lengths, all-same-digit documents, cross-document confusion like passing a CNPJ to `validateCPF`).

**HTTP mocking**: `lookupCEP` calls BrasilAPI via `fetch`. In integration tests, `vi.spyOn(globalThis, 'fetch')` intercepts the call and returns controlled responses. Tests verify: correct URL construction, successful response mapping, error handling for non-ok responses, and input validation before any HTTP call is made.

**Fake timers**: `formatRelativeDate` depends on the current time. Tests use `vi.useFakeTimers()` + `vi.setSystemTime()` to freeze time at a known instant, making assertions deterministic.

**What is deliberately not tested**: Brazilian holidays in `isBusinessDay` (it only checks weekends by design). Real HTTP calls to BrasilAPI/ViaCEP (those would be contract tests, not unit/integration tests). The `Intl.NumberFormat` and `Intl.DateTimeFormat` internals — I trust the platform.


## What I Would Do Differently

 - I would use `it.each` from the start for the validation test blocks. The repetitive `it("...", () => expect(fn(x)).toBe(y))` pattern across CPF, CNPJ, and CEP tests is exactly what parameterized tests solve. I only learned about this pattern after writing all the tests.
 - The initial `lookupCEP` implementation wrapped all errors in a generic try/catch, which hid the actual error type from callers. I should have let errors propagate naturally from the beginning — the try/catch added no value and made the function harder to debug.
 - I would add JSDoc from the start, not as a separate pass at the end. Writing the doc comment alongside the function forces you to articulate the contract (params, return value, error cases) which is essentially the same thinking you do when writing tests.


## AWS Equivalent

In AWS, utility functions like these would typically live in a **Lambda Layer** — a shared dependency package that multiple Lambda functions can reference. The testing patterns are identical: you mock external HTTP calls (like BrasilAPI), keep functions pure, and test the business logic in isolation from infrastructure. When a Lambda function calls an external API (like `lookupCEP` does), it needs network egress configured via a **NAT Gateway** or **VPC endpoint** — the networking knowledge from SAA studies directly applies. The CI pipeline (`tsc → eslint → vitest --coverage`) maps to a **CodePipeline** or **GitHub Actions** workflow that runs before deploying the Layer.

## Time Spent

| Phase | Hours |
|---|---|
| Setup + reading docs | 1h |
| Implementation | 1h |
| Tests | 2h |
| Debugging | 0.5h |
| README | 0.5h |
| **Total** | 5h |

---

## Open API Integration

**API**: BrasilAPI — https://brasilapi.com.br/api/cep/v2/{cep}
**Used for**: CEP address lookup (primary source)
**Mocked in tests**: Yes — via `vi.spyOn(global, 'fetch')`

**API**: ViaCEP — https://viacep.com.br/ws/{cep}/json
**Used for**: CEP address lookup (fallback)
**Mocked in tests**: Yes — via `vi.spyOn(global, 'fetch')`

## References

- [Vitest documentation](https://vitest.dev)
- [tsconfig/bases](https://github.com/tsconfig/bases)
- [BrasilAPI](https://brasilapi.com.br)
- [ViaCEP](https://viacep.com.br)
- [Node.js modules documentation](https://nodejs.org/api/modules.html)