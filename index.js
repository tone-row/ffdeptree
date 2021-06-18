#!/usr/bin/env node
const open = require("open");
const dependencyTree = require("dependency-tree");
const chokidar = require("chokidar");
const path = require("path");
const { compressToEncodedURIComponent } = require("lz-string");

// Prepare Arguments
const userArgs = require("minimist")(process.argv.slice(2));
const defaultArgs = {
  filter: "node_modules",
};
const args = { ...defaultArgs, ...userArgs };

if (!args.filename) throw new Error("Missing argument '--filename'");
if (!args.directory) throw new Error("Missing argument '--directory'");

const directory = path.join(process.cwd(), args.directory);

let filterRegex;
// Convert regex filter to function
if ("filter" in args) {
  filterRegex = new RegExp(args.filter, "gi");
  args.filter = (path) => !path.match(filterRegex);
}

/* Remove ffdeptree-specific args */
let watch = false,
  port = 3040,
  fullscreen = true;
if (!(args?.watch == null)) {
  watch = Boolean(args.watch);
  delete args.watch;
}
if (args.port) {
  port = args.port;
  delete args.port;
}
if (args.fullscreen) {
  fullscreen = Boolean(args.fullscreen);
  delete args.fullscreen;
}

// Remove substring arg
delete args._;

console.debug(`Arguments being passed to dependency-tree:

${JSON.stringify(args)}`);

function getGraphUrl() {
  // Create Dependency Tree
  const tree = dependencyTree(args);
  let increment = 0;
  const getId = () => ++increment;
  const idByPath = {};
  const edges = {};

  (function recurseDependencies(parentDependencies, parentPath = null) {
    const parentId = idByPath[parentPath];
    if (parentPath && !(parentId in edges)) edges[parentId] = [];

    for (const childPath in parentDependencies) {
      if (!(childPath in idByPath)) {
        idByPath[childPath] = getId();
      }

      if (parentPath && !edges[parentId].includes(idByPath[childPath]))
        edges[parentId].push(idByPath[childPath]);
      recurseDependencies(parentDependencies[childPath], childPath);
    }
  })(tree);

  // Invert idByPath
  let pathById = {};
  for (const key in idByPath) {
    pathById[idByPath[key]] = key;
  }

  // Shorten paths if more than one file
  if (Object.values(pathById).length > 1) {
    // Incrementally remove first letter when matches all paths
    while (
      Object.values(pathById)
        .map((x) => x[0])
        .every((val, i, arr) => val === arr[0])
    ) {
      for (let key in pathById) {
        pathById[key] = pathById[key].slice(1);
      }
    }
  }
  const lines = ["~~~", "layout:", "  name: dagre", "  rankDir: TB", "~~~"];
  for (const index in edges) {
    lines.push(pathById[index]);
    for (const dependency of edges[index]) {
      lines.push("  (" + pathById[dependency] + ")");
    }
  }

  return `https://flowchart.fun/${
    fullscreen ? "f" : "c"
  }#${compressToEncodedURIComponent(lines.join("\n"))}`.trim();
}

if (watch) {
  const express = require("express");
  const app = express();
  const http = require("http");
  const server = http.createServer(app);
  const { Server } = require("socket.io");
  const io = new Server(server);

  function generateAndEmit() {
    try {
      const url = getGraphUrl();
      io.emit("navigate", { url });
    } catch {
      console.error("Unable to parse tree");
    }
  }

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  // Begin Watching Files
  chokidar.watch(directory).on("change", generateAndEmit);

  // When user connects
  io.on("connection", generateAndEmit);

  // Start Server
  server.listen(port, () => {
    console.log(`listening on *:${port}`);
  });

  // Open Site
  open(`http://localhost:${port}`);
} else {
  // open
  const url = getGraphUrl();
  console.log(`Opening: ${url}`);
  open(url);
}
