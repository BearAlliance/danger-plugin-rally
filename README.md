# danger-plugin-rally

[![Build Status](https://travis-ci.org/bearalliance/danger-plugin-rally.svg?branch=master)](https://travis-ci.org/bearalliance/danger-plugin-rally)
[![npm version](https://badge.fury.io/js/danger-plugin-rally.svg)](https://badge.fury.io/js/danger-plugin-rally)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> Tools for linking [Rally](https://www.broadcom.com/products/software/agile-development/rally-software) stories to pull requests

## Usage

Install:

```sh
npm install --save-dev danger-plugin-rally
```

At a glance:

```js
// dangerfile.js
import rally from 'danger-plugin-rally';

rally();
```

This plugin:

- Provides links to stories, tasks, and defects mentioned in commit messages, PR title, and PR description.
- Warns if no stories, tasks, or defects are found

**Note:** Only works with Bitbucket server right now. More to come!

## API

### rally([options])

#### options

##### requirePound

Type: `Boolean`

Default: `false`

Fails if story, task, or defect numbers are not prefixed with `#` in the commit body.
This useful if you are generating ticket links with [standard-version](https://www.npmjs.com/package/standard-version) or [semantic-release](https://www.npmjs.com/package/semantic-release)

##### bodyOnly

Type: `Boolean`

Default: `false`

Fails if story, task, or defect numbers mentioned in the commit header, rather than the body.

##### domain

Type: `String`

Default: `'https://rally1.rallydev.com'`

Hostname for your rally instance

## Changelog

See the GitHub [release history](https://github.com/bearalliance/danger-plugin-rally/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
