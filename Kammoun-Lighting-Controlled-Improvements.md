# Kammoun Lighting — Controlled Improvements & Maintenance

> **Agent instructions:** Follow this document as the scope of authorization. Do not commit, switch branches, or rewrite Git history unless the user explicitly authorizes it. Inspect the working tree before edits and preserve all pre-existing changes.

You are acting as a senior software engineer working on my existing Kammoun Lighting website.

You previously performed a read-only audit of this project. Now I authorize you to implement selected improvements from that audit, with strict boundaries.

Your objective is to improve code maintainability, reliability, performance, and security without unnecessarily changing the website's appearance or existing behavior.

**This is an implementation task, but only within the scope defined below. Do not treat the entire audit as permission to change everything.**

---

# 1. Decisions I Have Already Made

These decisions are final. Do not challenge them or attempt to reverse them.

## A. Sample products are intentional — DO NOT CHANGE THIS

The project currently merges sample products with real products from Supabase.

This is intentional. I am waiting to receive the complete, real product catalogue from my father, and the sample products temporarily fill the catalogue.

Therefore:

- Keep the current sample products.
- Keep the existing behavior that merges sample products with Supabase products.
- Do not disable, remove, hide, or conditionally exclude sample products.
- Do not introduce a demo-mode environment variable for this behavior.
- Do not change product references, prices, stock quantities, categories, or sample images merely to eliminate hardcoded data.
- Do not change the existing product-merging logic unless a separate, demonstrable bug requires a minimal fix.
- You may still improve unrelated product utilities, validation, performance, or code organization as long as the intentional sample-product behavior remains unchanged.

## B. Supabase Storage security configuration — LEAVE IT ALONE

The audit identified differences between `supabase/schema.sql` and `supabase-security-fixes.sql`.

For now, do not investigate, merge, rewrite, reorganize, or apply changes to this configuration.

Specifically:

- Do not modify either SQL file.
- Do not change storage bucket visibility or policies.
- Do not change storage access permissions.
- Do not run SQL migrations or modify the remote Supabase database.
- Do not attempt to fix the previously reported Storage configuration discrepancy.

This is explicitly out of scope for this task.

Other security improvements unrelated to Supabase Storage remain in scope, provided they can be implemented safely.

---

# 2. Mandatory Preservation Rules

Before doing anything, inspect the current repository state.

Use read-only commands to inspect `git status`, the project structure, and the relevant source files.

The previous audit identified pre-existing modified and untracked files, including changes in `package.json`, `vite.config.js`, source files, `src/lib/productFilters.js`, and `public/assets/icons/`.

**These files may contain my existing work. Do not overwrite, revert, discard, reset, or replace any pre-existing changes.**

Follow these rules:

- Never run `git reset`, `git checkout --`, `git restore`, `git clean`, or equivalent destructive commands.
- Do not overwrite existing user changes simply because they differ from Git.
- Do not modify unrelated files.
- Do not create commits, switch branches, or rewrite Git history.
- Do not install or upgrade dependencies unless absolutely necessary and explicitly justified. Prefer the existing stack.
- Do not run database migrations or remote write operations.
- Do not expose API keys, passwords, tokens, or other secrets in your output.
- Do not claim a test passed if you did not run it.
- Do not remove functionality just to simplify the code.

If an intended change overlaps with pre-existing modifications and you cannot safely preserve them, stop that specific change, explain the conflict, and continue with independent tasks.

---

# 3. Implementation Priorities

Work through the following tasks in order. Inspect the actual source code before implementing each one.

## Task 1 — Improve the admin security model

Relevant areas identified by the audit:

- `src/pages/AdminPage.jsx`
- `src/data/siteContent.js`
- Supabase authentication and authorization usage

The device passphrase hash is embedded in frontend code, and the unlock state is stored in `localStorage`.

Review how this works alongside the existing Supabase authentication and Row Level Security setup.

Requirements:

- Ensure actual privileged operations rely on server-enforced authorization rather than a client-side passphrase or local storage flag.
- Do not weaken or bypass existing Supabase authentication or database authorization.
- Do not remove or break the current admin login workflow without a verified, safe replacement.
- Do not remove the device gate solely for code cleanliness if doing so would unintentionally change the intended user experience.
- Determine whether the existing device gate is merely an additional convenience layer or is being incorrectly relied upon for security.
- Remove or improve the client-side security mechanism only if it is safe to do so without breaking legitimate admin access.
- Do not introduce a new backend, authentication provider, or paid service just for this improvement.
- Do not access production credentials or make changes to the remote Supabase project.

If server-side authorization cannot be verified from the repository, document that limitation instead of claiming the system is secure.

## Task 2 — Improve hardcoded business content and duplicated configuration

Inspect:

- `src/data/siteContent.js`
- `src/lib/supabase.js`
- `src/lib/seo.js`
- `src/pages/HomePage.jsx`
- Relevant components that consume this data

The goal is not to eliminate all hardcoded values. It is to eliminate unnecessary duplication and reduce avoidable maintenance work.

Implement suitable, low-risk improvements such as:

- Centralizing repeated business configuration and UI constants.
- Removing duplicate metadata descriptions where a clean single source of truth is practical.
- Moving repeated marquee content into the existing content configuration when appropriate.
- Ensuring missing required configuration is handled clearly instead of silently routing users to an unintended hardcoded contact number.
- Preserving sensible local-development behavior where necessary.
- Reusing existing constants rather than duplicating the same values across components.
- Keeping static content in source code when moving it to a database would provide little practical benefit.

Do not migrate the entire content system to Supabase or introduce a CMS. Do not change the actual company information, contact details, social links, opening hours, or marketing copy unless required to fix a confirmed defect and the intended value is verifiable.

Preserve all existing content and the current French-language website.

## Task 3 — Improve brand logo and image reliability

Inspect the logo assets and the `BRAND_LOGOS` data in `src/data/siteContent.js`.

The audit identified large logo files and several external logo URLs, including potentially fragile URLs and placeholder imagery.

Implement only improvements that preserve the actual visual content and branding.

Requirements:

- Inspect image dimensions, file sizes, formats, and actual usage before changing assets.
- Optimize oversized local assets where the result can be verified visually.
- Preserve image transparency, aspect ratios, sharpness, and existing branding.
- Do not replace a real company logo with an AI-generated logo or an unrelated image.
- Do not download replacement brand assets from untrusted sources.
- Replace a fragile external URL with a local asset only if the correct corresponding logo is already available and verified.
- Do not invent or guess brand logos.
- If a logo is missing or its source cannot be verified, document the issue instead of silently substituting another image.

Keep all existing asset paths working, or update their references consistently when a verified optimization requires it.

Do not introduce a new image-processing dependency unless genuinely necessary.

## Task 4 — Refactor the oversized admin page carefully

The audit identified `src/pages/AdminPage.jsx` as a large component responsible for authentication, product management, image uploads, imports, exports, inventory, and testimonial moderation.

Refactor it into smaller modules only where this meaningfully improves maintainability.

Potential extraction targets include:

- Admin session and authentication logic.
- Product data operations.
- Image upload helpers.
- CSV/Excel import and export utilities.
- Product form and inventory components.
- Testimonial moderation components.

These are suggestions, not a requirement to create every module.

Requirements:

- First map the existing responsibilities and dependencies.
- Make incremental, logically grouped changes.
- Keep the same admin routes, forms, fields, labels, buttons, visual design, and user workflow.
- Preserve product creation, editing, deletion, filtering, stock handling, image uploads, imports, exports, and testimonial moderation.
- Preserve the existing Supabase data structure and behavior.
- Avoid creating unnecessary abstractions or dozens of tiny files.
- Do not refactor the entire project in one large rewrite.
- Preserve any pre-existing changes in the working tree.

If the component can be improved sufficiently through a smaller extraction, prefer that over an extensive rewrite.

## Task 5 — Reduce duplicated logic and improve product-data consistency

Inspect the existing product utilities and the files identified by the audit, including:

- `src/data/sampleProducts.js`
- `src/lib/productFilters.js`
- `src/lib/productUtils.js`, if present
- `src/components/ui/KelvinSwatch.jsx`
- `src/components/ui/ProductCard.jsx`
- `src/pages/ProductDetailPage.jsx`
- `src/lib/csv.js`
- `src/lib/spreadsheet.js`

Implement focused improvements where duplicated logic is confirmed.

Examples:

- Centralize duplicated color-temperature parsing and normalization.
- Reuse product image parsing instead of repeating equivalent logic.
- Normalize imported product fields consistently.
- Validate CSV/Excel data before attempting database writes.
- Provide clear row-level validation errors when practical.
- Validate required fields, numeric values, references, and availability values against the existing data model.
- Preserve legitimate empty values and existing product formats.
- Keep sample-product generation and sample-product merging intact.

Do not change product data semantics or introduce a new product schema without a clear compatibility plan.

## Task 6 — Improve performance without premature optimization

Inspect the public catalogue and admin inventory data-loading paths.

Implement only optimizations justified by the existing code and project size.

Potential improvements:

- Avoid repeated parsing or computations inside rendering loops.
- Lazy-load the admin page and its heavy dependencies if this can be done safely.
- Improve image loading and sizing where beneficial.
- Remove genuinely unused imports or dead code when verified.
- Avoid unnecessary re-renders where a clear problem exists.

Do not add pagination or server-side filtering simply because the audit suggested it. The product catalogue is still being populated, so the current approach may be appropriate.

Do not introduce caching systems, state-management libraries, or new dependencies without a concrete need.

## Task 7 — Verify routing, SEO, and deployment behavior

Inspect:

- `src/App.jsx`
- `src/lib/seo.js`
- `index.html`
- `vite.config.js`
- `vercel.json`

Check for:

- Confirmed duplication in SEO metadata.
- Incorrect or inconsistent metadata handling.
- Broken direct navigation or refresh behavior on nested routes.
- Opportunities for safe route-level code splitting.
- Existing deployment assumptions that should be preserved.

Do not automatically add a Vercel rewrite because the audit did not test the deployed site. Determine whether the existing configuration and routing behavior justify it.

Do not change URLs, page titles, descriptions, canonical URLs, social metadata, or the public route structure without a clear reason.

Preserve the existing SEO behavior and verify any proposed changes as far as local inspection and safe testing allow.

## Task 8 — Add basic automated tests where practical

Inspect `package.json` and existing test infrastructure before deciding how to proceed.

If no test framework exists, first determine whether a lightweight option using the existing stack is feasible.

Prioritize tests for:

- Product filtering.
- Product URL/reference matching.
- Color-temperature parsing.
- CSV parsing and validation.
- Product normalization.
- Availability labels and edge cases.

Do not add a large testing framework or upgrade dependencies unnecessarily.

If adding a dependency would require network access, a lockfile change, or a risky installation, explain the trade-off before proceeding with that part.

Never alter package versions merely to make a test setup easier.

---

# 4. Strictly Out-of-Scope Changes

Do not perform any of the following as part of this task:

- Changing or removing the intentional sample-product merge.
- Removing sample products or replacing them with invented real inventory.
- Changing Supabase Storage policies, bucket visibility, or related SQL.
- Applying SQL migrations or modifying the live database.
- Redesigning the website, changing its layout, or introducing a new visual theme.
- Rewriting the application from scratch.
- Migrating the application to TypeScript.
- Replacing the existing routing system without a demonstrated need.
- Moving all content into Supabase or introducing a CMS.
- Adding new business features unrelated to these improvements.
- Changing real business data without verification.
- Making speculative security changes that could lock out the administrator.
- Performing a deployment or modifying production infrastructure.

---

# 5. Working Method

Use this workflow:

### Step 1 — Establish the baseline

- Inspect the current Git status and relevant files.
- Identify all pre-existing user changes.
- Map the relevant code paths and dependencies.
- Identify which audit findings are confirmed and which remain uncertain.
- Do not change files during this initial inspection.

### Step 2 — Implement in small groups

- Start with the smallest high-value, low-risk improvements.
- Make one logically grouped set of changes at a time.
- Review the resulting diff before moving on.
- Preserve the current UI and all intentional behavior.
- If a task is unsafe, blocked, or requires information you do not have, skip it and explain why.

### Step 3 — Verify after each group

Use existing, safe local checks where possible.

Examples include:

- Reviewing changed-file diffs.
- Running existing unit tests if they are known to be safe.
- Running linting only if an existing, non-mutating lint command is configured.
- Performing a build only after checking that its scripts do not execute unintended side effects and that generated artifacts will not overwrite user work.
- Checking for broken imports and inconsistent references through static inspection.

Do not run formatters, automatic fixers, generators, or commands that modify unrelated files.

If a check could change files or has uncertain side effects, do not run it.

### Step 4 — Protect existing work

Before and after each logically grouped change:

- Inspect the relevant diff.
- Ensure pre-existing user modifications remain intact.
- Do not reset the working tree to establish a clean baseline.
- Distinguish your changes from changes that existed before you started.
- If attribution is uncertain, state that uncertainty honestly.

### Step 5 — Final verification

At the end:

- Review every file changed by this task.
- Check for unintended visual, functional, routing, or data-flow changes.
- Confirm that sample-product merging remains intact.
- Confirm that no Supabase Storage SQL or policy configuration was changed.
- List any checks that passed, failed, or were not performed.
- Identify remaining issues requiring manual verification.

---

# 6. Final Report

When you finish, provide a concise but useful implementation report containing:

1. **Changes implemented:** What changed and why.
2. **Files modified:** Each file and a short description of its changes.
3. **Security improvements:** What was actually improved and what remains unverified.
4. **Maintainability improvements:** Duplicated logic, configuration, or admin responsibilities addressed.
5. **Performance improvements:** Only measured or code-supported improvements.
6. **Testing and verification:** Exact checks performed and their results.
7. **Skipped tasks:** Anything not implemented, with the reason.
8. **Remaining recommendations:** Only the most valuable outstanding items.
9. **Working-tree integrity:** What you could verify about preservation of pre-existing work.

Do not claim performance improvements were measured if they were not measured. Do not claim security is guaranteed if server-side policies or production behavior could not be verified.

## Final instruction

Proceed with the approved improvements, in priority order, while respecting every boundary above.

**You have permission to modify relevant project source files for the explicitly approved tasks, but not to make unrelated changes. Preserve the existing Kammoun Lighting website, its design, its intended sample-product behavior, and all pre-existing user work.**
and dont commit until i say so
