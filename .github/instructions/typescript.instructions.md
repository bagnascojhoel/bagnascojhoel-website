---
applyTo: **/*.ts
description: How to use TypeScript in this project
---

- Use `inversify` for dependency injection. Decorate classes with `@injectable()` and use
  `@inject()` for injecting dependencies.
- Always use named exports for anything. Ex. `export default { MyClass, myFunction };`.
