## Summary

<!-- What changed? Why is it useful for players or maintainers? -->

## Quality checklist

- [ ] I ran `yarn prettify --check` or `yarn prettify`
- [ ] I ran `yarn lint`
- [ ] I ran `yarn test --runInBand`
- [ ] I ran `yarn build`

## Desktop checklist

If this PR changes `desktop/`, `dist/*.html`, lobby/game URLs, or release config:

- [ ] I ran `yarn desktop:package`
- [ ] I updated or added desktop navigation tests in `test/desktop/`
- [ ] I checked that in-app billiards links stay inside Electron and true external links open in the browser

## Screenshots or recordings

<!-- Add screenshots, recordings, or before/after notes for UI changes. -->
