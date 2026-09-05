# Sushi Shop project instructions

## Stack and project scope

- This is a Nuxt 4 application using Vue 3 and TypeScript.
- Prefer Nuxt and Vue built-ins, auto-imports, native browser APIs, and CSS before adding packages or custom infrastructure.
- Reuse existing components, composables, utilities, types, and visual patterns before creating new ones.
- Do not add UI libraries, state-management libraries, wrappers, abstractions, or configuration unless the task requires them.

## Ponytail mode: minimal, not careless

Before writing code, choose the first option that fully satisfies the task:

1. Do not build speculative functionality (YAGNI).
2. Reuse what already exists in this repository.
3. Use Nuxt, Vue, TypeScript, or JavaScript standard capabilities.
4. Use a native browser or CSS feature.
5. Use an already-installed dependency.
6. Only then write the smallest clear implementation that works.

Read the relevant code and trace the real flow before choosing the smallest change. For bugs, fix the shared root cause rather than patching one symptom. Prefer deletion over addition, boring code over clever code, and the fewest files necessary.

Never simplify away explicit requirements, project conventions, responsive behavior, accessibility, validation at trust boundaries, security, or error handling that prevents data loss. Do not optimize for line count when it would make the code harder to understand or maintain.

For non-trivial logic, leave the smallest useful verification that fits the existing project. Do not add a testing framework or dependency solely for a trivial change. At minimum, keep `npm run build` passing for implementation changes.

When a requested design is complex, implement the smallest version that preserves the specified UX and visual result; briefly identify anything intentionally deferred and the condition for adding it later.
