# kiwivm-mcp

MCP server for managing KiwiVM (64clouds/BuyVM) VPS instances via Claude Code.

## Setup

### 1. Environment Variables

```bash
export KIWIVM_VEID=12345678
export KIWIVM_API_KEY=your_api_key_here
```

Get your VEID and API key from the KiwiVM Control Panel → REST API page.

### 2. Install

```bash
npx kiwivm-mcp
```

Requires **Node.js >= 24** (native TypeScript support).

### 3. Claude Code Configuration

Add to your Claude Code settings:

```json
{
  "mcpServers": {
    "kiwivm": {
      "command": "npx",
      "args": ["kiwivm-mcp"],
      "env": {
        "KIWIVM_VEID": "12345678",
        "KIWIVM_API_KEY": "your_key"
      }
    }
  }
}
```

Or with global install:

```bash
npm install -g kiwivm-mcp
```

```json
{
  "mcpServers": {
    "kiwivm": {
      "command": "kiwivm-mcp",
      "env": {
        "KIWIVM_VEID": "12345678",
        "KIWIVM_API_KEY": "your_key"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `kiwivm_power` | Start, stop, restart, or force kill the VPS |
| `kiwivm_service_info` | Get plan details, IPs, OS, and bandwidth. Set `include_live=true` for live CPU, RAM, disk, uptime (may take 15s) |
| `kiwivm_snapshot` | Create, list, delete, restore, toggle sticky, export/import snapshots |
| `kiwivm_backup` | List automatic backups, copy backup to restorable snapshot |
| `kiwivm_system` | Set hostname, PTR/rDNS, reset root password, manage SSH keys, list/reinstall OS templates |
| `kiwivm_network` | Add/delete IPv6 /64 subnets, assign/delete/list private IP addresses |
| `kiwivm_monitoring` | View raw usage stats, audit log, API rate limit status |
| `kiwivm_admin` | View suspensions/policy violations, unsuspend, resolve violations |

## License

MIT
