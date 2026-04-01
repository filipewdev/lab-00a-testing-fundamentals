# Lab 00-A — Testing Fundamentals

![CI](https://github.com/filipewdev/lab-00a-testing-fundamentals/actions/workflows/ci.yml/badge.svg)
[![Coverage](https://img.shields.io/badge/coverage-XX%25-brightgreen)](#tests)

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
│   ├── cpf.ts       → validate, format, strip
│   ├── cnpj.ts      → validate, format, strip
│   └── cep.ts       → lookup (BrasilAPI → ViaCEP fallback)
│
├── tests/
│   ├── unit/        → pure logic, no I/O
│   └── integration/ → mocked HTTP via vi.spyOn(global, 'fetch')
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

### # Scoped vs unscoped npm packages

The only real difference is the namespace prefix — `@filipewdev/br-utils` is scoped, `br-utils` is not. 

Scoping prevents naming on the global npm registry, which matters when publishing a library anyone could install. 

The practical gotcha: scoped packages publish as private by default, so you need `--access public` or `"publishConfig": { "access": "public" }` in `package.json` to make them publicly installable.


### # tsconfig.json is not just boilerplate

Frameworks generate it for you so it's easy to ignore, but each field has real consequences.

 - `strict: true` enables a family of type checks that catch entire classes of bugs. 
 - `noUncheckedIndexedAccess` makes array access return `T | undefined` instead of silently the index exists. 
 - `NodeNext` module resolution enforces explicit file extensions in imports. 
 - For a library, `declaration: true` is non-negotiable — without it, TypeScript consumers of your package get no type information at all.

The community-maintained bases at [tsconfig/bases](https://github.com/tsconfig/bases) are a good reference for sensible starting points per runtime.


### # Test-first changes how you design APIs

Writing tests before the implementation forces you to think about the public interface — what the function receives, what it returns, what it throws — before you think about how it works internally. 

For a validation library this is particularly valuable: the test cases become the specification for every edge case (empty strings, wrong check digits, all-same-digit CPFs) before a single line of implementation exists.


### # Vitest essentials

Everything comes from one import: `describe`, `it`, `expect`, `beforeEach`, `vi`.

 - `describe` groups related cases, `it` defines a single case, `expect` withmatchers (`toBe`, `toEqual`, `toThrow`, `toMatchObject`) asserts the outcome.
 - `vi.spyOn(global, 'fetch')` replaces the real HTTP call with a controlled fake — this is what makes integration tests fast and offline-capable. 
 - Test Filtering(`.todo`, `.fails`, `.skipIf`) controls execution per test. 
 - Test Tags (definedin `vitest.config.ts`) are named categories with shared config like `timeout`.
 - Annotations are per-test metadata for reporting only.


## Tests

<!-- Fill this in once the implementation is complete.
     Describe your strategy, not a list of test names.
     What did you test? What did you deliberately not test and why?
     What pattern did you use for the HTTP mocking? -->

## What I Would Do Differently

<!-- Fill this in honestly at the end.
     "Nothing, it all went perfectly" is never the right answer. -->

## AWS Equivalent

<!-- One paragraph connecting testing fundamentals and this library's
     structure to AWS equivalents.
     Reference: docs/aws-context.md in labs-roadmap. -->

## Time Spent

| Phase | Hours |
|---|---|
| Setup + reading docs | |
| Implementation | |
| Tests | |
| Debugging | |
| README | |
| **Total** | |

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