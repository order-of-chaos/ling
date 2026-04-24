import { spawnSync } from 'node:child_process';
import process from 'node:process';

const [, , command = 'help', ...args] = process.argv;
const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const gitBin = process.platform === 'win32' ? 'git.exe' : 'git';
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const commandHandlers = {
  help: runHelp,
  login: runLogin,
  whoami: runWhoami,
  status: runStatus,
  version: runVersion,
  check: runCheck,
  publish: runPublish,
  ship: runShip,
};

const handler = commandHandlers[command];

if (!handler) {
  stderr(`Unknown release command: ${command}\n\n`);
  runHelp();
  process.exit(1);
}

handler(args);

function runHelp() {
  stdout(`Ling release commands

Usage:
  pnpm release:login
  pnpm release:whoami
  pnpm release:status
  pnpm release:version
  pnpm release:check
  pnpm release:publish -- --otp=123456
  pnpm release:ship -- --otp=123456

Commands:
  login    Run npm login using the current npm client flow
  whoami   Show the npm account that will publish packages
  status   Show pending changesets and package bumps
  version  Apply changesets locally and update package versions
  check    Run lint, test, build, and package tarball checks
  publish  Build packages and publish versioned packages via changesets
  ship     Run install, check, publish, and then remind to push tags
`);
}

function runLogin(extraArgs) {
  runNpm(['login', ...extraArgs]);
}

function runWhoami(extraArgs) {
  runNpm(['whoami', ...extraArgs]);
}

function runStatus(extraArgs) {
  runPnpm(['exec', 'changeset', 'status', '--verbose', ...extraArgs]);
}

function runVersion(extraArgs) {
  ensureCleanGit();
  runPnpm(['exec', 'changeset', 'version', ...extraArgs]);
}

function runCheck() {
  runPnpm(['lint']);
  runPnpm(['test']);
  runPnpm(['build']);
  runPnpm(['pack:packages']);
}

function runPublish(extraArgs) {
  ensureCleanGit();
  ensureNpmAuth();
  runPnpm(['build:packages']);
  runPnpm(['exec', 'changeset', 'publish', ...extraArgs]);
}

function runShip(extraArgs) {
  ensureCleanGit();
  ensureNpmAuth();
  runPnpm(['install', '--frozen-lockfile']);
  runCheck();
  runPublish(extraArgs);
  stdout('\nRelease published. Push commits and tags with:\n');
  stdout('  git push --follow-tags\n');
}

function ensureCleanGit() {
  const status = spawnSync(gitBin, ['status', '--short'], {
    encoding: 'utf8',
  });

  if (status.status !== 0) {
    fail('Failed to read git status.');
  }

  if (status.stdout.trim().length > 0) {
    fail(
      `Working tree is not clean. Commit or stash changes before running this command.\n\n${status.stdout}`,
    );
  }
}

function ensureNpmAuth() {
  const result = spawnSync(npmBin, ['whoami'], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    fail(
      'npm authentication is required. Run `pnpm release:login` first, then retry.',
    );
  }

  const username = result.stdout.trim();

  if (!username) {
    fail(
      'npm authentication check returned an empty username. Run `pnpm release:login` first, then retry.',
    );
  }

  stdout(`Using npm account: ${username}\n`);
}

function runPnpm(pnpmArgs) {
  stdout(`\n> ${pnpmBin} ${pnpmArgs.join(' ')}\n`);

  const result = spawnSync(pnpmBin, pnpmArgs, {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runNpm(npmArgs) {
  stdout(`\n> ${npmBin} ${npmArgs.join(' ')}\n`);

  const result = spawnSync(npmBin, npmArgs, {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function stdout(message) {
  process.stdout.write(message);
}

function stderr(message) {
  process.stderr.write(message);
}

function fail(message) {
  stderr(`${message}\n`);
  process.exit(1);
}
