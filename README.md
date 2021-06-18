# ffdeptree

🌳 (**f**lowchart **f**un **dep**endency **tree**)

![Demo of using ffdeptree in watch mode](/demo.gif)

**ffdeptree** visualizes the structure of file imports in javascript or typescript projects. It uses [node-dependency-tree](https://github.com/dependents/node-dependency-tree) to parse the files and create the graph, and [flowchart-fun](https://flowchart.fun/) to make the visualization.

## How to Use

I recommend running with `npx` to avoid adding dependencies to your project.

```
npx ffdeptree --filename src/index.ts --directory src/
```

The `--filename` and `--directory` arguments are required, where the filename is the entry file to your project and the directory is where your source code lives.

## API

With the exception of `--watch`, `--port` and `--fullscreen`, all other arguments are passed to node-dependency-tree. You can see the arguments it accepts [here](https://github.com/dependents/node-dependency-tree#usage).

| Argument     | Value              | Description                                             |
| ------------ | ------------------ | ------------------------------------------------------- |
| --watch      | 0 or 1 (default 0) | Whether to watch files and sync changes in browser      |
| --port       | (default 3040)     | Which port to use in watch mode                         |
| --fullscreen | 0 or 1 (default 1) | Whether to show visualization using full browser window |
