import os
import subprocess
from typing import Optional, Dict, List

from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp import Context

# Create an MCP server
mcp = FastMCP("Go Commands Server")


def run_command(command: List[str], cwd: Optional[str] = None, env: Optional[Dict[str, str]] = None) -> str:
    """Run a shell command and return its output."""
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            env={**os.environ, **(env or {})},
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if result.returncode != 0:
            raise subprocess.CalledProcessError(result.returncode, command, result.stderr)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return f"Error: {e.stderr.strip()}"


@mcp.tool()
def go_version(ctx: Context, env: Optional[Dict[str, str]] = None) -> str:
    """Returns the current Go version installed on the system."""
    return run_command(["go", "version"], env=env)


@mcp.tool()
def go_env(ctx: Context, env: Optional[Dict[str, str]] = None) -> str:
    """Returns the current Go environment variables."""
    return run_command(["go", "env"], env=env)


@mcp.tool()
def go_build(ctx: Context, project_path: str, flags: str = "", packages: str = "./...", env: Optional[Dict[str, str]] = None) -> str:
    """Builds Go packages in a specified project directory."""
    return run_command(["go", "build", flags, packages], cwd=project_path, env=env)


@mcp.tool()
def go_run(ctx: Context, project_path: str, file: str, flags: str = "", env: Optional[Dict[str, str]] = None) -> str:
    """Runs a Go file in a specified project directory."""
    return run_command(["go", "run", flags, file], cwd=project_path, env=env)


@mcp.tool()
def go_test(ctx: Context, project_path: str, flags: str = "", packages: str = "./...", env: Optional[Dict[str, str]] = None) -> str:
    """Runs Go tests for specified packages in a given project directory."""
    return run_command(["go", "test", flags, packages], cwd=project_path, env=env)


@mcp.tool()
def go_mod_init(ctx: Context, project_path: str, module_name: str, env: Optional[Dict[str, str]] = None) -> str:
    """Initializes a new Go module in the specified project directory."""
    return run_command(["go", "mod", "init", module_name], cwd=project_path, env=env)


@mcp.tool()
def go_mod_tidy(ctx: Context, project_path: str, env: Optional[Dict[str, str]] = None) -> str:
    """Tidies up the Go module dependencies in the specified project directory."""
    return run_command(["go", "mod", "tidy"], cwd=project_path, env=env)


@mcp.tool()
def go_mod_verify(ctx: Context, project_path: str, env: Optional[Dict[str, str]] = None) -> str:
    """Verifies the Go module dependencies in a specified project directory."""
    return run_command(["go", "mod", "verify"], cwd=project_path, env=env)


@mcp.tool()
def go_fmt(ctx: Context, project_path: str, packages: str = "./...", env: Optional[Dict[str, str]] = None) -> str:
    """Formats the Go code for specified packages in a given project directory."""
    return run_command(["go", "fmt", packages], cwd=project_path, env=env)


@mcp.tool()
def go_vet(ctx: Context, project_path: str, packages: str = "./...", env: Optional[Dict[str, str]] = None) -> str:
    """Runs the Go vet tool on specified packages in a given project directory."""
    return run_command(["go", "vet", packages], cwd=project_path, env=env)


@mcp.tool()
def go_doc(ctx: Context, project_path: str, symbol: str, env: Optional[Dict[str, str]] = None) -> str:
    """Generates documentation for a given Go symbol in a specified project directory."""
    return run_command(["go", "doc", symbol], cwd=project_path, env=env)

if __name__ == "__main__":
    mcp.run()