const HELP = `Usage: kiwivm-cli <category> <action> [--flags...]

Auth: --veid <VEID> --api-key <KEY>  (or KIWIVM_VEID / KIWIVM_API_KEY env vars)

Categories:

  power       start | stop | restart | kill
  info        (no action) | live
  snapshot    create | list | delete | restore | sticky | export | import
  backup      list | copy
  system      hostname | rdns | password | sshkey | os | reinstall
  network     ipv6-add | ipv6-delete | private-list | private-assign | private-delete
  monitoring  usage | audit | rate-limit
  admin       suspensions | unsuspend | resolve | resolve-violation

Flags:

  --description     Snapshot description (snapshot create)
  --snapshot        Snapshot file name (snapshot delete/restore/sticky/export)
  --sticky          0 or 1 (snapshot sticky)
  --source-veid     Source VEID (snapshot import)
  --source-token    Source token (snapshot import)
  --backup-token    Backup token (backup copy)
  --new-hostname    New hostname (system hostname)
  --ip              IP address (system rdns, network ipv6-delete/private-assign/private-delete)
  --ptr             PTR/rDNS record (system rdns)
  --ssh-keys        SSH keys (system sshkey update)
  --os              OS template name (system reinstall)
  --record-id       Record ID (admin unsuspend/resolve-violation)

Output: JSON to stdout. Errors to stderr with exit code 1.
`;

export async function run(): Promise<string> {
  return HELP;
}
