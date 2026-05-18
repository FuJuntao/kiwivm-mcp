# kiwivm-cli

CLI for managing KiwiVM (64clouds/BuyVM) VPS instances.

## Setup

### 1. Environment Variables

```bash
export KIWIVM_VEID=12345678
export KIWIVM_API_KEY=your_api_key_here
```

Get your VEID and API key from the KiwiVM Control Panel -- REST API page.

Alternatively, pass them as flags on every command:

```bash
kiwivm-cli --veid 12345678 --api-key your_key info
```

### 2. Install

Requires **Node.js >= 24**.

```bash
npm install -g kiwivm-cli
```

Or run directly with npx:

```bash
npx kiwivm-cli help
```

## Usage

```bash
kiwivm-cli <command> [<subcommand>] [args...] [--flags...]
```

### Examples

```bash
# Get service info
kiwivm-cli info

# Get live status (CPU, RAM, disk, uptime)
kiwivm-cli status

# Power control
kiwivm-cli start
kiwivm-cli stop
kiwivm-cli restart
kiwivm-cli kill

# Snapshots
kiwivm-cli snapshot list
kiwivm-cli snapshot create --desc "before update"
kiwivm-cli snapshot delete vsb1234567890
kiwivm-cli snapshot restore vsb1234567890
kiwivm-cli snapshot sticky vsb1234567890 --on
kiwivm-cli snapshot export vsb1234567890
kiwivm-cli snapshot import 87654321 token123

# Backups
kiwivm-cli backup list
kiwivm-cli backup copy abc123

# System
kiwivm-cli hostname my-vps
kiwivm-cli password

# SSH keys
kiwivm-cli ssh-key
kiwivm-cli ssh-key set "ssh-ed25519 AAAAC3..."

# OS
kiwivm-cli os list
kiwivm-cli os reinstall ubuntu-22.04

# rDNS
kiwivm-cli rdns set 1.2.3.4 my.domain.com

# IPv6
kiwivm-cli ipv6 add
kiwivm-cli ipv6 delete 2001:db8::1

# Private IP
kiwivm-cli private-ip list
kiwivm-cli private-ip assign 10.0.0.5
kiwivm-cli private-ip delete 10.0.0.5

# ISO
kiwivm-cli iso mount ubuntu-22.04-live
kiwivm-cli iso unmount

# Shell
kiwivm-cli shell exec "uptime"
kiwivm-cli shell script "apt update && apt upgrade -y"

# Migrate
kiwivm-cli migrate locations
kiwivm-cli migrate start "Las Vegas"
kiwivm-cli clone 1.2.3.4 "root-pass" --port 22

# Stats
kiwivm-cli stats usage
kiwivm-cli stats audit
kiwivm-cli stats rate-limit

# Admin
kiwivm-cli suspensions
kiwivm-cli unsuspend 123
kiwivm-cli violations
kiwivm-cli violations resolve 456

# Notifications
kiwivm-cli notifications
kiwivm-cli notifications set '{"1":1,"2":0}'
```

Output is JSON to stdout. Errors go to stderr with exit code 1.

## Development

```bash
git clone https://github.com/FuJuntao/kiwivm-cli.git
cd kiwivm-cli
npm install
```

| Command | Description |
|---------|-------------|
| `npm test` | Run tests (vitest) |
| `npm run typecheck` | Type check (tsc --noEmit) |
| `npm run build` | Build with tsdown -> `dist/index.mjs` |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run check` | Lint + format check |

## License

MIT
