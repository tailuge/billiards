# Security Policy

## Supported versions

Security fixes target the current `master` branch and the latest deployed web and desktop builds.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Report it privately through GitHub's private vulnerability reporting if it is enabled for the repository, or contact the maintainer listed in `package.json`.

Include enough detail to reproduce and assess impact:

- affected URL, build, or desktop package
- steps to reproduce
- expected and actual behavior
- browser, OS, and Electron/Desktop context if relevant
- whether user interaction, network access, or multiplayer input is required

## Security expectations

- Electron desktop code keeps `nodeIntegration` disabled, `contextIsolation` enabled, and `sandbox` enabled.
- Local desktop navigation must stay inside the packaged `dist` directory.
- External links should open in the system browser rather than gaining app privileges.
- New lobby/game route behavior should be covered by `test/desktop/navigation.spec.js`.
- Pull requests should pass formatting, lint, tests, coverage generation, dependency audit, web build, and desktop packaging checks.
