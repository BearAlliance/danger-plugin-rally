## Development

Install dependencies with

```bash
npm ci
```

Run the test suite with

```bash
npm test
```

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated NPM package publishing.

The main caveat: instead of running `git commit`, run `yarn commit` and follow the prompts to input a conventional changelog message via [commitizen](https://github.com/commitizen/cz-cli).

:heart:
