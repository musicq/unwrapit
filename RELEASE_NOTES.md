---
### Release Notes for Version 3.0.1

#### Documentation and discovery

- Reworked the README around `unwrapit`'s small exception-boundary use case.
- Linked npm users to the current VitePress documentation site.
- Improved package description, search keywords, homepage, and issue metadata.
- Replaced the misleading bare `wrap(fetch)` example with explicit HTTP status
  handling.

#### Reliability

- Added support for cross-realm promises and other `PromiseLike` values.
- Deprecated partial `match` handlers and documented their `undefined` risk;
  stricter types are reserved for the next major release.
- Clean stale build chunks automatically before creating the npm package.
- Run runtime and type tests automatically before publishing.
- Added continuous integration for tests, type tests, and builds.

---

### Release Notes for Version 3.0.0

We are excited to announce the release of **v3.0.0** of **Unwrapit**, which brings significant updates, new features, and improvements for better usability and efficiency. Below are the key enhancements and additions:

---

#### 🚀 **Enhancements**
1. **Comprehensive Usage Guide**
   - A detailed usage guide has been added to the `README.md` file.
   - The guide includes:
     - "Getting Started" section with basic and async examples.
     - Full API reference for methods like `wrap`, `ok/err`, `Result` methods (`unwrap`, `unwrapOr`, `unwrapOrElse`, `expect`, `mapErr`, `match`).
     - Configuration setup details and integration guides with RxJS are also provided.

2. **Optimized Bundle Size**
   - The `toWrap` function was separated from the main entry point to effectively reduce the bundle size.

#### 📦 **Additional Features**
3. **Curried `wrap` Function**
   - Introduced a curried version of the `wrap` function to allow users to more easily specify the `Result` type.
   - The function can now directly infer the `Result` type in various scenarios, removing the need for users to explicitly specify the result types in common use cases. This enables more intuitive and flexible usage patterns while enhancing type safety.

#### 🧪 **Improved Testing**
4. **Testing for `wrap` Functionality**
   - Comprehensive test cases added to cover:
     - Synchronous, async, promise, and value wrapping scenarios.
     - Error handling tests to verify proper behavior when exceptions occur.

---

This major release marks a significant milestone for Unwrapit, focusing on enhancing the library's usability and ensuring high-quality performance. Thank you for being part of the Unwrapit community, and we look forward to your feedback!
