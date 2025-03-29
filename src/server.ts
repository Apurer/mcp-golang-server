// Redirect console.log to stderr
console.log = function (...args) {
  process.stderr.write(args.join(" ") + "\n");
};

console.error = function (...args) {
  process.stderr.write("ERROR: " + args.join(" ") + "\n");
};

import * as fs from "fs";
import * as path from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod"; // Make sure this package is installed
import {
  goVersion,
  goEnv,
  goBuild,
  goRun,
  goTest,
  goModInit,
  goModTidy,
  goModVerify,
  goFmt,
  goVet,
  goDoc,
} from "./goCommands";

// Get allowed directories from command line arguments
const allowedDirectories = process.argv.slice(2);
console.log("Server started. Allowed directories:", allowedDirectories);

// Create an MCP server following the SDK pattern
const server = new McpServer({
  name: "Go Commands Server",
  version: "1.0.0",
});

// Define Go commands as tools using the SDK pattern

server.tool(
  "goVersion",
  "Returns the current Go version installed on the system.",
  {},
  async () => ({
    content: [{ type: "text", text: await goVersion() }],
  })
);

server.tool(
  "goEnv",
  "Returns the Go environment variables.",
  {},
  async () => ({
    content: [{ type: "text", text: await goEnv() }],
  })
);

server.tool(
  "goBuild",
  "Builds Go packages with optional flags.",
  { flags: z.string().optional(), packages: z.string().optional() },
  async ({ flags = "", packages = "./..." }: { flags?: string; packages?: string }) => ({
    content: [{ type: "text", text: await goBuild(flags, packages) }],
  })
);

server.tool(
  "goRun",
  "Runs a Go file with optional flags.",
  { file: z.string(), flags: z.string().optional() },
  async ({ file, flags = "" }: { file: string; flags?: string }) => ({
    content: [{ type: "text", text: await goRun(file, flags) }],
  })
);

server.tool(
  "goTest",
  "Runs Go tests for specified packages with optional flags.",
  { flags: z.string().optional(), packages: z.string().optional() },
  async ({ flags = "", packages = "./..." }: { flags?: string; packages?: string }) => ({
    content: [{ type: "text", text: await goTest(flags, packages) }],
  })
);

server.tool(
  "goModInit",
  "Initializes a new Go module with the given module name.",
  { moduleName: z.string() },
  async ({ moduleName }: { moduleName: string }) => ({
    content: [{ type: "text", text: await goModInit(moduleName) }],
  })
);

server.tool(
  "goModTidy",
  "Tidies up the Go module dependencies.",
  {},
  async () => ({
    content: [{ type: "text", text: await goModTidy() }],
  })
);

server.tool(
  "goModVerify",
  "Verifies the Go module dependencies.",
  {},
  async () => ({
    content: [{ type: "text", text: await goModVerify() }],
  })
);

server.tool(
  "goFmt",
  "Formats the Go code for the specified packages.",
  { packages: z.string().optional() },
  async ({ packages = "./..." }: { packages?: string }) => ({
    content: [{ type: "text", text: await goFmt(packages) }],
  })
);

server.tool(
  "goVet",
  "Runs the Go vet tool on specified packages.",
  { packages: z.string().optional() },
  async ({ packages = "./..." }: { packages?: string }) => ({
    content: [{ type: "text", text: await goVet(packages) }],
  })
);

server.tool(
  "goDoc",
  "Generates documentation for a given Go symbol.",
  { symbol: z.string() },
  async ({ symbol }: { symbol: string }) => ({
    content: [{ type: "text", text: await goDoc(symbol) }],
  })
);

// Directory listing tool with path validation
server.tool(
  "listDir",
  "Lists files in the given directory if it is allowed.",
  { dirPath: z.string() },
  async ({ dirPath }: { dirPath: string }) => {
    const isAllowed = allowedDirectories.some((dir) => dirPath.startsWith(dir));

    if (!isAllowed) {
      return {
        content: [
          { type: "text", text: `Access denied: ${dirPath} is not an allowed directory` },
        ],
        isError: true,
      };
    }

    try {
      const files = await fs.promises.readdir(dirPath);
      return {
        content: [{ type: "text", text: `Files in directory ${dirPath}:\n${files.join("\n")}` }],
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error accessing directory: ${error}` }],
        isError: true,
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  console.error("Error connecting to transport:", err);
  process.exit(1);
});
