# danger-plugin-dev

[![Build Status](https://travis-ci.org/bearalliance/danger-plugin-rally.svg?branch=master)](https://travis-ci.org/bearalliance/danger-plugin-rally)
[![npm version](https://badge.fury.io/js/danger-plugin-rally.svg)](https://badge.fury.io/js/danger-plugin-dev)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> tools for linking rally stories to pull requests

## Usage

Install:

```sh
npm install --save-dev danger-plugin-rally
```

At a glance:

```js
// dangerfile.js
import rally from 'danger-plugin-rally'

rally();
```

This plugin:
- Provides links to stories and defects mentioned in commit messages, PR title, and PR description.
- Warns if no stories or defects are found


Only works with Bitbucket server right now. More to come!
## Changelog

See the GitHub [release history](https://github.com/bearalliance/danger-plugin-dev/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
