# Releasing

This repository uses Changesets for versioning and release pull requests, but npm publishing is intentionally manual.

That split is deliberate:

- GitHub Actions validates the repo
- GitHub Actions opens or updates the release PR
- GitHub Actions deploys the marketing site to GitHub Pages
- npm publishing is done locally by a maintainer who confirms 2FA

## Workflow

1. Add a changeset in feature PRs that change published packages:

   ```bash
   pnpm changeset
   ```

2. Merge feature PRs into `master`.

3. GitHub Actions runs `Release PR` on every push to `master` and creates or updates the release PR.

4. Review and merge the release PR.

5. GitHub Actions runs `Deploy Pages` on the merge commit and updates GitHub Pages.

6. Publish the already-versioned packages locally from `master`.

## Local Release Commands

All local release operations go through one wrapper script: [`scripts/release.mjs`](./scripts/release.mjs).

Login to npm first:

```bash
pnpm release:login
pnpm release:whoami
```

Check release state:

```bash
pnpm release:status
```

Apply version bumps locally:

```bash
pnpm release:version
```

Run the full local validation suite before publishing:

```bash
pnpm release:check
```

Publish all unpublished package versions to npm:

```bash
pnpm release:publish
```

One-shot maintainer command:

```bash
pnpm release:ship
```

If npm needs an OTP explicitly, pass it through:

```bash
pnpm release:publish -- --otp=123456
pnpm release:ship -- --otp=123456
```

`release:publish` builds the workspace packages and runs `changeset publish`. npm will prompt for 2FA confirmation as needed.
Browser-based npm authentication during `npm login` or `npm publish` is expected.

## Maintainer Checklist

From a clean local checkout:

```bash
git checkout master
git pull
pnpm release:login
pnpm release:ship
```

## What Each Workflow Does

- `CI`: lint, build, test, and bundle-size checks on pull requests and pushes to `master`
- `Release PR`: creates or updates the Changesets release PR on pushes to `master`
- `Deploy Pages`: builds the website and force-pushes `website/dist` to `gh-pages`

## Notes

- `release:version`, `release:publish`, and `release:ship` require a clean git working tree.
- `release:publish` and `release:ship` also require an active npm login and will print the npm user before publishing.
- The default repository flow still uses the release PR for versioning.
- `release:version` is there for maintainers when they explicitly want to version locally.
- Do not use `pnpm --filter <package> publish` for normal releases. It bypasses the workspace release flow and can publish packages in the wrong order.

## npm Troubleshooting

If the first publish of a scoped package fails with `E404`, check the npm scope and permissions first:

```bash
npm whoami
npm access ls-packages
```

For `@orderofchaos/*`, the publishing user must have access to the `@orderofchaos` scope in npm.
