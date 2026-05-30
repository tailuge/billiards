# Welcome

Contributions are welcomed, especially input on physics of ball spin and cushion interactions.

## Development workflow

Use Corepack so Yarn matches the version pinned in `package.json`:

```shell
corepack enable
yarn install --immutable
```

Before opening a pull request, run the same quality gates as CI:

```shell
yarn prettify --check
yarn lint
yarn test --runInBand
yarn audit
yarn build
```

If you change desktop packaging, game/lobby routes, or files under `desktop/`, also run:

```shell
yarn desktop:package
```

Desktop route behavior is intentionally tested in `test/desktop/navigation.spec.js` so the app keeps billiards pages inside Electron while external sites open in the browser.
