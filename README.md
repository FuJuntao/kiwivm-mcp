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
kiwivm-cli <category> <action> [--flags...]
```

### Examples

```bash
# Get service info
kiwivm-cli info

# Get live service info (CPU, RAM, disk, uptime)
kiwivm-cli info live

# Power control
kiwivm-cli power start
kiwivm-cli power stop
kiwivm-cli power restart
kiwivm-cli power kill

# Snapshots
kiwivm-cli snapshot list
kiwivm-cli snapshot create --description "before update"
kiwivm-cli snapshot delete --snapshot vsb1234567890
kiwivm-cli snapshot restore --snapshot vsb1234567890
kiwivm-cli snapshot sticky --snapshot vsb1234567890 --sticky 1
kiwivm-cli snapshot import --source-veid 87654321 --source-token token123

# Backups
kiwivm-cli backup list
kiwivm-cli backup copy --backup-token abc123

# System
kiwivm-cli system hostname --new-hostname my-vps
kiwivm-cli system rdns --ip 1.2.3.4 --ptr my.domain.com
kiwivm-cli system password
kiwivm-cli system sshkey
kiwivm-cli system sshkey --ssh-keys "ssh-ed25519 AAAAC3..."
kiwivm-cli system os
kiwivm-cli system reinstall --os "ubuntu-22.04"

# Network
kiwivm-cli network ipv6-add
kiwivm-cli network ipv6-delete --ip 2001:db8::1
kiwivm-cli network private-list
kiwivm-cli network private-assign --ip 10.0.0.5
kiwivm-cli network private-delete --ip 10.0.0.5

# Monitoring
kiwivm-cli monitoring usage
kiwivm-cli monitoring audit
kiwivm-cli monitoring rate-limit

# Admin
kiwivm-cli admin suspensions
kiwivm-cli admin unsuspend --record-id 123
kiwivm-cli admin resolve
kiwivm-cli admin resolve-violation --record-id 456
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
