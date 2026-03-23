const { spawn } = require("child_process");
const path = require("path");

const rootDir = process.cwd();
const clientDir = path.join(rootDir, "client");

const spawnWithLogs = (name, command, args, options = {}) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: command.toLowerCase().endsWith(".cmd"),
    ...options,
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }
  });

  child.on("error", (error) => {
    console.error(`${name} failed:`, error.message);
  });

  return child;
};

const server = spawnWithLogs("server", "node", ["server/server.js"]);
const client = spawnWithLogs("client", "npm.cmd", ["run", "dev"], { cwd: clientDir });

const shutdown = () => {
  server.kill();
  client.kill();
  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
