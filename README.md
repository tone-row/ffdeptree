<div align="center">

# ffdeptree

<!-- prettier-ignore-start -->
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
<!-- prettier-ignore-end -->

Visualize the structure of file imports in typescript or javascript projects with one command.

![Demo of using ffdeptree in watch mode](/demo.gif)

</div>

## How to Use

Run this command inside your codebase:

```
npx ffdeptree --filename src/index.ts --directory src/
```

- `--filename` is the path to the file whose import graph will be visualized.
- `--directory` is where the source code lives.

## How It Works

The package uses [node-dependency-tree](https://github.com/dependents/node-dependency-tree) to parse the files and create the graph, and [flowchart-fun](https://flowchart.fun/) to make the visualization.

In watch mode, it uses [express](https://github.com/expressjs/express) and [socket.io](https://github.com/socketio/socket.io) open the group and dynamically update the page.

This package was inspired by [madge](https://github.com/pahen/madge)

## API

With the exception of `--watch`, `--port` and `--fullscreen`, all other arguments are passed to node-dependency-tree. You can see the arguments it accepts [here](https://github.com/dependents/node-dependency-tree#usage).

| Argument     | Value              | Description                                             |
| ------------ | ------------------ | ------------------------------------------------------- |
| --watch      | 0 or 1 (default 0) | Whether to watch files and sync changes in browser      |
| --port       | (default 3040)     | Which port to use in watch mode                         |
| --fullscreen | 0 or 1 (default 1) | Whether to show visualization using full browser window |

## Contributions

Contributions of any kind welcome!

## License

MIT

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/ffdeptree.svg?style=flat-square
[package]: https://www.npmjs.com/package/ffdeptree
[downloads-badge]: https://img.shields.io/npm/dm/ffdeptree.svg?style=flat-square
[npmtrends]: https://www.npmtrends.com/ffdeptree
[license-badge]: https://img.shields.io/npm/l/ffdeptree.svg?style=flat-square
[license]: https://github.com/tone-row/ffdeptree/blob/main/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: https://makeapullrequest.com
<!-- prettier-ignore-end -->
