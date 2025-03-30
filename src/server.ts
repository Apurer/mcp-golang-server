// server.ts
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
  { env: z.record(z.string()).optional() },
  async ({ env = {} }: { env?: Record<string, string> }) => ({
    content: [{ type: "text", text: await goVersion(env) }],
  })
);

server.tool(
  "goEnv",
  "Returns the Go environment variables.",
  { env: z.record(z.string()).optional() },
  async ({ env = {} }: { env?: Record<string, string> }) => ({
    content: [{ type: "text", text: await goEnv(env) }],
  })
);

server.tool(
  "goBuild",
  "Builds Go packages with optional flags in a specified project directory.",
  {
    projectPath: z.string(),
    flags: z.string().optional(),
    packages: z.string().optional(),
    env: z.record(z.string()).optional(),
  },
  async ({
    projectPath,
    flags = "",
    packages = "./...",
    env = {},
  }: {
    projectPath: string;
    flags?: string;
    packages?: string;
    env?: Record<string, string>;
  }) => ({
    content: [{ type: "text", text: await goBuild(flags, packages, projectPath, env) }],
  })
);

server.tool(
  "goRun",
  "Runs a Go file with optional flags in a specified project directory.",
  {
    projectPath: z.string(),
    file: z.string(),
    flags: z.string().optional(),
    env: z.record(z.string()).optional(),
  },
  async ({
    projectPath,
    file,
    flags = "",
    env = {},
  }: {
    projectPath: string;
    file: string;
    flags?: string;
    env?: Record<string, string>;
  }) => ({
    content: [{ type: "text", text: await goRun(file, flags, projectPath, env) }],
  })
);

server.tool(
  "goTest",
  "Runs Go tests for specified packages with optional flags in a specified project directory.",
  {
    projectPath: z.string(),
    flags: z.string().optional(),
    packages: z.string().optional(),
    env: z.record(z.string()).optional(),
  },
  async ({
    projectPath,
    flags = "",
    packages = "./...",
    env = {},
  }: {
    projectPath: string;
    flags?: string;
    packages?: string;
    env?: Record<string, string>;
  }) => ({
    content: [{ type: "text", text: await goTest(flags, packages, projectPath, env) }],
  })
);

server.tool(
  "goModInit",
  "Initializes a new Go module with the given module name in a specified project directory.",
  {
    projectPath: z.string(),
    moduleName: z.string(),
    env: z.record(z.string()).optional(),
  },
  async ({
    projectPath,
    moduleName,
    env = {},
  }: {
    projectPath: string;
    moduleName: string;
    env?: Record<string, string>;
  }) => ({
    content: [{ type: "text", text: await goModInit(moduleName, projectPath, env) }],
  })
);

server.tool(
  "goModTidy",
  "Tidies up the Go module dependencies in a specified project directory.",
  {
    projectPath: z.string(),
    env: z.record(z.string()).optional(),
  },
  async ({
    projectPath,
    env = {},
  }: {
    projectPath: string;
    env?: Record<string, string>;
  }) => ({
    content: [{ type: "text", text: await goModTidy(projectPath, env) }],
  })
);

server.tool(
  "goModVerify",
  "Verifies the Go module dependencies in a specified project directory.",
  {
    projectPath: z.string(),
    env: z.record(z.string()).optional(),
  },
  async ({
    projectPath,
    env = {},
  }: {
    projectPath: string;
    env?: Record<string, string>;
  }) => ({
    content: [{ type: "text", text: await goModVerify(projectPath, env) }],
  })
);

server.tool(
  "goFmt",
  "Formats the Go code for the specified packages in a specified project directory.",
  {
    projectPath: z.string(),
    packages: z.string().optional(),
    env: z.record(z.string()).optional(),
  },
  async ({
    projectPath,
    packages = "./...",
    env = {},
  }: {
    projectPath: string;
    packages?: string;
    env?: Record<string, string>;
  }) => ({
    content: [{ type: "text", text: await goFmt(packages, projectPath, env) }],
  })
);

server.tool(
  "goVet",
  "Runs the Go vet tool on specified packages in a specified project directory.",
  {
    projectPath: z.string(),
    packages: z.string().optional(),
    env: z.record(z.string()).optional(),
  },
  async ({
    projectPath,
    packages = "./...",
    env = {},
  }: {
    projectPath: string;
    packages?: string;
    env?: Record<string, string>;
  }) => ({
    content: [{ type: "text", text: await goVet(packages, projectPath, env) }],
  })
);

server.tool(
  "goDoc",
  "Generates documentation for a given Go symbol in a specified project directory.",
  {
    projectPath: z.string(),
    symbol: z.string(),
    env: z.record(z.string()).optional(),
  },
  async ({
    projectPath,
    symbol,
    env = {},
  }: {
    projectPath: string;
    symbol: string;
    env?: Record<string, string>;
  }) => ({
    content: [{ type: "text", text: await goDoc(symbol, projectPath, env) }],
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
