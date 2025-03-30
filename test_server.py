import unittest
from unittest.mock import patch, MagicMock, ANY
import subprocess  # Import subprocess to use subprocess.PIPE
from server import (
    run_command,
    go_version,
    go_env,
    go_build,
    go_run,
    go_test,
    go_mod_init,
    go_mod_tidy,
    go_mod_verify,
    go_fmt,
    go_vet,
    go_doc,
)
from mcp.server.fastmcp import Context


class TestServer(unittest.TestCase):
    @patch("subprocess.run")
    def test_run_command_error(self, mock_run):
        # Mock the subprocess.run result with a valid stderr
        mock_run.return_value = MagicMock(returncode=1, stderr="Error occurred")
        result = run_command(["echo", "test"])
        self.assertEqual(result, "Error: Error occurred")  # Expect the correct error message
        mock_run.assert_called_once_with(
            ["echo", "test"],
            cwd=None,
            env=ANY,  # Allow any environment variables
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

    @patch("server.run_command")
    def test_go_version(self, mock_run_command):
        mock_run_command.return_value = "go version go1.18.3 linux/amd64"
        ctx = Context()
        result = go_version(ctx)
        self.assertEqual(result, "go version go1.18.3 linux/amd64")
        mock_run_command.assert_called_once_with(["go", "version"], env=None)

    @patch("server.run_command")
    def test_go_env(self, mock_run_command):
        mock_run_command.return_value = "GOPATH=/go"
        ctx = Context()
        result = go_env(ctx)
        self.assertEqual(result, "GOPATH=/go")
        mock_run_command.assert_called_once_with(["go", "env"], env=None)

    @patch("server.run_command")
    def test_go_build(self, mock_run_command):
        mock_run_command.return_value = "Build succeeded"
        ctx = Context()
        result = go_build(ctx, "/path/to/project", flags="-v", packages="./...")
        self.assertEqual(result, "Build succeeded")
        mock_run_command.assert_called_once_with(
            ["go", "build", "-v", "./..."], cwd="/path/to/project", env=None
        )

    @patch("server.run_command")
    def test_go_run(self, mock_run_command):
        mock_run_command.return_value = "Program output"
        ctx = Context()
        result = go_run(ctx, "/path/to/project", "main.go", flags="-race")
        self.assertEqual(result, "Program output")
        mock_run_command.assert_called_once_with(
            ["go", "run", "-race", "main.go"], cwd="/path/to/project", env=None
        )

    @patch("server.run_command")
    def test_go_test(self, mock_run_command):
        mock_run_command.return_value = "Tests passed"
        ctx = Context()
        result = go_test(ctx, "/path/to/project", flags="-v", packages="./...")
        self.assertEqual(result, "Tests passed")
        mock_run_command.assert_called_once_with(
            ["go", "test", "-v", "./..."], cwd="/path/to/project", env=None
        )

    @patch("server.run_command")
    def test_go_mod_init(self, mock_run_command):
        mock_run_command.return_value = "Module initialized"
        ctx = Context()
        result = go_mod_init(ctx, "/path/to/project", "example.com/module")
        self.assertEqual(result, "Module initialized")
        mock_run_command.assert_called_once_with(
            ["go", "mod", "init", "example.com/module"], cwd="/path/to/project", env=None
        )

    @patch("server.run_command")
    def test_go_mod_tidy(self, mock_run_command):
        mock_run_command.return_value = "Dependencies tidied"
        ctx = Context()
        result = go_mod_tidy(ctx, "/path/to/project")
        self.assertEqual(result, "Dependencies tidied")
        mock_run_command.assert_called_once_with(
            ["go", "mod", "tidy"], cwd="/path/to/project", env=None
        )

    @patch("server.run_command")
    def test_go_mod_verify(self, mock_run_command):
        mock_run_command.return_value = "All modules verified"
        ctx = Context()
        result = go_mod_verify(ctx, "/path/to/project")
        self.assertEqual(result, "All modules verified")
        mock_run_command.assert_called_once_with(
            ["go", "mod", "verify"], cwd="/path/to/project", env=None
        )

    @patch("server.run_command")
    def test_go_fmt(self, mock_run_command):
        mock_run_command.return_value = "Code formatted"
        ctx = Context()
        result = go_fmt(ctx, "/path/to/project", packages="./...")
        self.assertEqual(result, "Code formatted")
        mock_run_command.assert_called_once_with(
            ["go", "fmt", "./..."], cwd="/path/to/project", env=None
        )

    @patch("server.run_command")
    def test_go_vet(self, mock_run_command):
        mock_run_command.return_value = "No issues found"
        ctx = Context()
        result = go_vet(ctx, "/path/to/project", packages="./...")
        self.assertEqual(result, "No issues found")
        mock_run_command.assert_called_once_with(
            ["go", "vet", "./..."], cwd="/path/to/project", env=None
        )

    @patch("server.run_command")
    def test_go_doc(self, mock_run_command):
        mock_run_command.return_value = "Documentation output"
        ctx = Context()
        result = go_doc(ctx, "/path/to/project", "fmt.Println")
        self.assertEqual(result, "Documentation output")
        mock_run_command.assert_called_once_with(
            ["go", "doc", "fmt.Println"], cwd="/path/to/project", env=None
        )


if __name__ == "__main__":
    unittest.main()