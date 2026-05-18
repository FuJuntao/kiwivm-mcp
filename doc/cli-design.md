# CLI Design

## Philosophy

- **Flat, discoverable commands** — no `category/action` hierarchy
- **Common operations are top-level verbs** — `start`, `stop`, `info`, `status`
- **Subcommands for grouped CRUD** — `snapshot list|create|delete|...`
- **Positional args for required values, `--flags` for optional**

## Command Reference

```
POWER
  start                         Start the VPS
  stop                          Stop the VPS
  restart                       Reboot the VPS
  kill                          Force-stop a stuck VPS

INFO
  info                          Get service info (plan, IPs, bandwidth, etc.)
  status                        Get live status (CPU, RAM, disk, uptime)

SNAPSHOTS
  snapshot list                 List all snapshots
  snapshot create [--desc]      Create a new snapshot
  snapshot delete <token>       Delete a snapshot
  snapshot restore <token>      Restore from snapshot (destroys all data)
  snapshot sticky <token>       Toggle sticky (--on | --off)
  snapshot export <token>       Generate transfer token for snapshot
  snapshot import <veid> <token> Import snapshot from another instance

BACKUPS
  backup list                   List automatic backups
  backup copy <token>           Convert backup to restorable snapshot

OS
  os list                       List available OS templates
  os reinstall <template>       Reinstall OS (destroys all data)

HOSTNAME
  hostname <name>               Set new hostname

PASSWORD
  password                      Reset root password

SSH KEYS
  ssh-key                       Show current SSH keys
  ssh-key set <keys>            Set SSH keys

rDNS
  rdns set <ip> <ptr>           Set reverse DNS record

IPv6
  ipv6 add                      Assign new IPv6 /64 subnet
  ipv6 delete <subnet>          Release IPv6 subnet

PRIVATE IP
  private-ip list               List available private IPs
  private-ip assign [<ip>]      Assign private IP (random if omitted)
  private-ip delete <ip>        Release private IP

ISO
  iso mount <name>              Mount ISO for boot (VM must be off)
  iso unmount                   Unmount ISO, boot from disk

SHELL
  shell exec <command>          Execute command synchronously
  shell script <script>         Execute script asynchronously

MIGRATION
  migrate locations             List available migration locations
  migrate start <location>      Start migration to new location
  clone <ip> <password> [--port] Clone from external server (OVZ only)

STATS
  stats usage                   Get detailed usage statistics
  stats audit                   Get audit log
  stats rate-limit              Check API rate limit status

ADMIN
  suspensions                   View suspension details
  unsuspend <record-id>         Clear abuse issue and unsuspend
  violations                    View policy violations
  violations resolve <record-id> Resolve policy violation

NOTIFICATIONS
  notifications                 Get notification preferences
  notifications set <json>      Update notification preferences
```

## Examples

```bash
kiwivm-cli start
kiwivm-cli status
kiwivm-cli snapshot create --desc "pre-upgrade"
kiwivm-cli snapshot delete vsb1234567890
kiwivm-cli os reinstall "ubuntu-22.04"
kiwivm-cli rdns set 1.2.3.4 my.domain.com
kiwivm-cli shell exec "uptime"
kiwivm-cli migrate locations
```
