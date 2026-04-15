# kiwivm-mcp

MCP server for managing KiwiVM (64clouds/BuyVM) VPS instances via Claude Code.

## Setup

### Environment Variables

```bash
export KIWIVM_VEID=12345678
export KIWIVM_API_KEY=your_api_key_here
```

Get your VEID and API key from the KiwiVM Control Panel -> REST API page.

### Local Development

```bash
npm install
KIWIVM_VEID=... KIWIVM_API_KEY=... node src/index.ts
```

### Claude Code Configuration

Add to your Claude Code settings:

```json
{
  "mcpServers": {
    "kiwivm": {
      "command": "node",
      "args": ["/path/to/kiwivm-mcp/src/index.ts"],
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
| `kiwivm_service_info` | Get plan details, IPs, OS, bandwidth. Optionally include live status |
| `kiwivm_snapshot` | Create, list, delete, restore, export/import snapshots |
| `kiwivm_backup` | List automatic backups, copy backup to snapshot |
| `kiwivm_system` | Set hostname, PTR/rDNS, SSH keys, root password, reinstall OS |
| `kiwivm_network` | Manage IPv6 subnets and private IP addresses |
| `kiwivm_monitoring` | View usage stats, audit log, API rate limit status |
| `kiwivm_admin` | View suspensions/policy violations, unsuspend, resolve violations |

## License

MIT
