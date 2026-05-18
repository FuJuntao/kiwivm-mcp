# REST API

Whether you want to automate nightly snapshots, monitor your VPS status, or even build a custom replacement for the KiwiVM panel, this page has you covered.

To export a CSV-formatted list of API keys for all instances under your account, use the CSV export feature in our billing portal.

All parameters can be passed using either the GET or POST methods.

# PHP examples

```
// Sample 1. Get information about server
$request = "https://api.64clouds.com/v1/getServiceInfo?veid=1432687&api_key=YOUR_API_KEY_HERE";
$serviceInfo = json_decode (file_get_contents ($request));
print_r ($serviceInfo);


/* ------------------------------- [ output ] -------------------------------
stdClass Object
(
    [hostname] => my.server.com
    [node_alias] => Node32
    [node_location] => US, Florida
    [plan] => micro128
    [plan_monthly_data] => 322122547200
    [plan_disk] => 4294967296
    [plan_ram] => 155189248
    [plan_swap] => 37748736
    [os] => centos-6-x86_64
    [email] => customer@example.com
    [data_counter] => 569810827
    [data_next_reset] => 1430193600
    [ip_addresses] => Array
        (
            [0] => 11.22.33.44
            [1] => 11.22.33.45
        )

    [rdns_api_available] => 1
    [ptr] => stdClass Object
        (
            [11.22.33.44] => ns1.my.server.com
            [11.22.33.45] => ns2.my.server.com
        )

    [error] => 0
)
*/

// Sample 2. Create a snapshot
$request = "https://api.64clouds.com/v1/snapshot/create?description=Automatic_Snapshot&veid=1432687&api_key=YOUR_API_KEY_HERE";
$serviceInfo = json_decode (file_get_contents ($request));
print_r ($serviceInfo);

/* ------------------------------- [ output ] -------------------------------
stdClass Object
(
    [error] => 0
    [notificationEmail] => customer@example.com
)
*/

// Sample 3. Restart VPS
$request = "https://api.64clouds.com/v1/restart?veid=1432687&api_key=YOUR_API_KEY_HERE";
$serviceInfo = json_decode (file_get_contents ($request));
print_r ($serviceInfo);

/* ------------------------------- [ output ] -------------------------------
stdClass Object
(
    [error] => 0
)
*/

// Sample 4. Set PTR record
$request = "https://api.64clouds.com/v1/setPTR?ip=11.22.33.44&ptr=ns1.my.server.com&veid=1432687&api_key=YOUR_API_KEY_HERE";
$serviceInfo = json_decode (file_get_contents ($request));
print_r ($serviceInfo);

/* ------------------------------- [ output ] -------------------------------
stdClass Object
(
    [error] => 0
)
*/

// Sample 5. Restart VPS using wget
wget -qO- "https://api.64clouds.com/v1/restart?veid=1432687&api_key=YOUR_API_KEY_HERE"

/* ------------------------------- [ output ] -------------------------------
{"error":0}
*/

// Sample 6. Restart VPS using curl
//You may want to use curl instead as it allows passing all variables in a POST request

$requestData = array ("veid" => 1432687, "api_key" => "YOUR_API_KEY_HERE");
$request = "restart";
$ch = curl_init(); 
curl_setopt($ch, CURLOPT_URL, "https://api.64clouds.com/v1/$request"); 
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); // curl running on Windows has issues with SSL - 
                                             // see https://kb.ucla.edu/articles/how-do-i-use-curl-in-php-on-windows
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $requestData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
$jsonData = curl_exec($ch); 
if (curl_error($ch)) die("Connection Error: ".curl_errno($ch)." - ".curl_error($ch));
curl_close($ch);
print_r (json_decode ($jsonData));

/* ------------------------------- [ output ] -------------------------------
stdClass Object
(
    [error] => 0
)
*/
```

# Available calls

Each API call requires a valid combination of VEID (VPS ID) and the corresponding API key, as shown in the examples.

Every API call returns an *error* variable. If *error* is non-zero, refer to the message variable for detailed information about the issue.

<table width="100%" cellpadding="10">
  <tr>
    <th align="left" style="background-color:#e0e0e0">Call</th>
    <th align="left" style="background-color:#e0e0e0">Parameters</th>
    <th align="left" style="background-color:#e0e0e0">Description and return values</th>
  </tr>
  <tr>
    <td valign="top">start</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Starts the VPS</td>
  </tr>
  <tr>
    <td valign="top">stop</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Stops the VPS</td>
  </tr>
  <tr>
    <td valign="top">restart</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Reboots the VPS</td>
  </tr>
  <tr>
    <td valign="top">kill</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Allows to forcibly stop a VPS that is stuck and cannot be stopped by normal means. Please use this feature with great care as any unsaved data will be lost.</td>
  </tr>
  <tr>
    <td valign="top">getServiceInfo</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top"><i style="color:#d0d0d0">Returns</i><br><b>vm_type:</b> Hypervizor type (ovz or kvm)<br><b>hostname:</b> Hostname of the VPS<br><b>node_alias:</b> Internal nickname of the physical node<br><b>node_location:</b> Physical location (country, state)<br><b>location_ipv6_ready:</b> Whether IPv6 is supported at the current location<br><b>plan:</b> Name of plan<br><b>plan_disk:</b> Disk quota (bytes)<br><b>plan_ram:</b> RAM (bytes)<br><b>plan_swap:</b> SWAP (bytes)<br><b>os:</b> Operating system<br><b>email:</b> Primary e-mail address of the account<br><b>plan_monthly_data:</b> Allowed monthly data transfer (bytes). Needs to be multiplied by monthly_data_multiplier - see below.<br><b>data_counter:</b> Data transfer used in the current billing month. Needs to be multiplied by monthly_data_multiplier - see below.<br><b>monthly_data_multiplier:</b> Some locations offer more expensive bandwidth; this variable contains the bandwidth accounting coefficient.<br><b>data_next_reset:</b> Date and time of transfer counter reset (UNIX timestamp)<br><b>ip_addresses:</b> IPv4 addresses and IPv6 /64 subnets assigned to VPS (Array)<br><b>private_ip_addresses:</b> Private IPv4 addresses assigned to VPS (Array)<br><b>ip_nullroutes:</b> Information on IP address nullrouting during (D)DoS attacks (Array). Sample output when IP is under attack:<br><b>iso1:</b> Mounted image #1<br><b>iso2:</b> Mounted image #2 (currently unsupported)<br><b>available_isos:</b> Array of ISO images available for use<br><b>plan_max_ipv6s:</b> Maximum number of IPv6 /64 subnets allowed by plan<br><b>rdns_api_available:</b> Whether or not rDNS records can be set via API<br><b>plan_private_network_available:</b> Whether or not Private Network features are available on this plan<br><b>location_private_network_available:</b> Whether or not Private Network features are available at this location<br><b>ptr:</b> rDNS records (Array of two-dimensional arrays: ip=&gt;value)<br><b>suspended:</b> Whether VPS is suspended<br><b>policy_violation:</b> Whether there is an active policy violation that needs attention (see getPolicyViolations)<br><b>suspension_count:</b> Number of times service was suspended in current calendar year<br><b>total_abuse_points:</b> Total abuse points accumulated in current calendar year<br><b>max_abuse_points:</b> Maximum abuse points allowed by plan in a calendar year<br>
      <pre>
   [ip_nullroutes] =&gt; Array
        (
            [1.2.3.4] =&gt; Array
                (
                    [nullroute_timestamp] =&gt; 1556678627      // start of attack
                    [nullroute_duration_s] =&gt; 360            // duration of nullroute
                    [log] =&gt; "Packet dump data of the attack (multi-line)" // raw log of attack
                )

        )
</pre>
    </td>
  </tr>
  <tr>
    <td valign="top">getLiveServiceInfo</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">This function returns all data provided by getServiceInfo. In addition, it provides detailed status of the VPS.<br>Please note that this call may take up to 15 seconds to complete.<br><br>Depending on hypervisor this call will return the following information:<br><br><i style="color:#d0d0d0">Returns</i><br>[OVZ hypervisor]<br><b>vz_status:</b> array containing OpenVZ beancounters, system load average, number of processes, open files, sockets, memory usage etc<br><b>vz_quota:</b> array containing OpenVZ disk size, inodes and usage info<br><b>is_cpu_throttled:</b> 0 = CPU is not throttled, 1 = CPU is throttled due to high usage. Throttling resets automatically every 2 hours.<br><b>ssh_port:</b> SSH port of the VPS<br><br><i style="color:#d0d0d0">Returns</i><br>[KVM hypervisor]<br><b>ve_status:</b> Starting, Running or Stopped<br><b>ve_mac1:</b> MAC address of primary network interface<br><b>ve_used_disk_space_b:</b> Occupied (mapped) disk space in bytes<br><b>ve_disk_quota_gb:</b> Actual size of disk image in GB<br><b>is_cpu_throttled:</b> 0 = CPU is not throttled, 1 = CPU is throttled due to high usage. Throttling resets automatically every 2 hours.<br><b>is_disk_throttled:</b> 0 = Disk I/O is not throttled, 1 = Disk I/O is throttled due to high usage. Throttling resets automatically every 15-180 minutes depending on sustained storage I/O utilization.<br><b>ssh_port:</b> SSH port of the VPS (returned only if VPS is running)<br><b>live_hostname:</b> Result of "hostname" command executed inside VPS<br><b>load_average:</b> Raw load average string<br><b>mem_available_kb:</b> Amount of available RAM in KB<br><b>swap_total_kb:</b> Total amount of Swap in KB<br><b>swap_available_kb:</b> Amount of available Swap in KB<br><b>screendump_png_base64:</b> base64 encoded png screenshot of the VGA console</td>
  </tr>
  <tr>
    <td valign="top">getAvailableOS</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top"><i style="color:#d0d0d0">Returns</i><br><b>installed:</b> Currently installed Operating System<br><b>templates:</b> Array of available OS</td>
  </tr>
  <tr>
    <td valign="top">reinstallOS</td>
    <td valign="top">os</td>
    <td valign="top">Reinstall the Operating System. OS must be specified via "os" variable. Use getAvailableOS call to get list of available systems.<br><br><i style="color:#d0d0d0">Returns</i><br><b>rootPassword:</b> New root password<br><b>sshPort:</b> SSH port<br><b>sshKeys:</b> SSH keys uploaded to /root/.ssh/authorized_keys<br><b>sshKeysBrief:</b> SSH keys (shortened for visual presentation)<br><b>notificationEmail:</b> E-mail address where notification will be sent when complete</td>
  </tr>
  <tr>
    <td valign="top">updateSshKeys</td>
    <td valign="top">ssh_keys</td>
    <td valign="top">Update per-VM SSH keys in Hypervisor Vault. Keys will be written to /root/.ssh/authorized_keys during a reinstallOS call. These keys will override any keys set in Billing Portal.</td>
  </tr>
  <tr>
    <td valign="top">getSshKeys</td>
    <td valign="top"></td>
    <td valign="top">Get SSH keys stored in Hypervisor Vault, as well as the ones stored in Billing Portal.<br><br><i style="color:#d0d0d0">Returns</i><br><b>ssh_keys_veid:</b> Per-VM SSH Keys stored in Hypervisor Vault<br><b>ssh_keys_user:</b> Per-Account SSH keys stored in Billing Portal<br><b>ssh_keys_preferred:</b> SSH Keys which will be actually used during a reinstallOS call (Per-VM Keys will always override Per-Account keys)<br><b>shortened_ssh_keys_veid:</b> Visually shortened keys<br><b>shortened_ssh_keys_user:</b> Visually shortened keys<br><b>shortened_ssh_keys_preferred:</b> Visually shortened keys</td>
  </tr>
  <tr>
    <td valign="top">resetRootPassword</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Generates and sets a new root password.<br><br><i style="color:#d0d0d0">Returns</i><br><b>password:</b> New root password</td>
  </tr>
  <tr>
    <td valign="top">getUsageGraphs</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Obsolete, use getRawUsageStats instead</td>
  </tr>
  <tr>
    <td valign="top">getRawUsageStats</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Returns a two-dimensional array with the detailed usage statistics shown under Detailed Statistics in KiwiVM.</td>
  </tr>
  <tr>
    <td valign="top">getAuditLog</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Returns an array with the detailed audit log shown under Audit Log in KiwiVM.</td>
  </tr>
  <tr>
    <td valign="top">setHostname</td>
    <td valign="top">newHostname</td>
    <td valign="top">Sets new hostname.</td>
  </tr>
  <tr>
    <td valign="top">setPTR</td>
    <td valign="top">ip, ptr</td>
    <td valign="top">Sets new PTR (rDNS) record for IP.</td>
  </tr>
  <tr>
    <td valign="top">iso/mount</td>
    <td valign="top">iso</td>
    <td valign="top">Sets ISO image to boot from. VM must be completely shut down and restarted after this API call.</td>
  </tr>
  <tr>
    <td valign="top">iso/unmount</td>
    <td valign="top"></td>
    <td valign="top">Removes ISO image and configures VM to boot from primary storage. VM must be completely shut down and restarted after this API call.</td>
  </tr>
  <tr>
    <td valign="top">basicShell/cd</td>
    <td valign="top">currentDir, newDir</td>
    <td valign="top">Simulate change of directory inside of the VPS. Can be used to build a shell like Basic shell.<br><br><i style="color:#d0d0d0">Returns</i><br><b>pwd:</b> Result of the "pwd" command after the change.</td>
  </tr>
  <tr>
    <td valign="top">basicShell/exec</td>
    <td valign="top">command</td>
    <td valign="top">Execute a shell command on the VPS (synchronously).<br><br><i style="color:#d0d0d0">Returns</i><br><b>error:</b> Exit status code of the executed command<br><b>message:</b> Console output of the executed command</td>
  </tr>
  <tr>
    <td valign="top">shellScript/exec</td>
    <td valign="top">script</td>
    <td valign="top">Execute a shell script on the VPS (asynchronously).<br><br><i style="color:#d0d0d0">Returns</i><br><b>log:</b> Name of the output log file.</td>
  </tr>
  <tr>
    <td valign="top">snapshot/create</td>
    <td valign="top">description (optional)</td>
    <td valign="top">Create snapshot<br><br><i style="color:#d0d0d0">Returns</i><br><b>notificationEmail:</b> E-mail address on file where notification will be sent once task is completed.</td>
  </tr>
  <tr>
    <td valign="top">snapshot/list</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Get list of snapshots.<br><br><i style="color:#d0d0d0">Returns</i><br><b>snapshots:</b> Array of snapshots (fileName, os, description, size, md5, sticky, purgesIn, downloadLink, downloadLinkSSL).</td>
  </tr>
  <tr>
    <td valign="top">snapshot/delete</td>
    <td valign="top">snapshot</td>
    <td valign="top">Delete snapshot by fileName (can be retrieved with snapshot/list call).</td>
  </tr>
  <tr>
    <td valign="top">snapshot/restore</td>
    <td valign="top">snapshot</td>
    <td valign="top">Restores snapshot by fileName (can be retrieved with snapshot/list call). This will overwrite all data on the VPS.</td>
  </tr>
  <tr>
    <td valign="top">snapshot/toggleSticky</td>
    <td valign="top">snapshot, sticky</td>
    <td valign="top">Set or remove sticky attribute ("sticky" snapshots are never purged). Name of snapshot can be retrieved with snapshot/list call – look for fileName variable.<br>Set sticky = 1 to set sticky attribute<br>Set sticky = 0 to remove sticky attribute</td>
  </tr>
  <tr>
    <td valign="top">snapshot/export</td>
    <td valign="top">snapshot</td>
    <td valign="top">Generates a token with which the snapshot can be transferred to another instance.</td>
  </tr>
  <tr>
    <td valign="top">snapshot/import</td>
    <td valign="top">sourceVeid, sourceToken</td>
    <td valign="top">Imports a snapshot from another instance identified by VEID and Token. Both VEID and Token must be obtained from another instance beforehand with a snapshot/export call.</td>
  </tr>
  <tr>
    <td valign="top">backup/list</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Get list of automatic backups.<br><br><i style="color:#d0d0d0">Returns</i><br><b>backups:</b> Array of backups (backupToken, size, os, md5, timestamp).</td>
  </tr>
  <tr>
    <td valign="top">backup/copyToSnapshot</td>
    <td valign="top">backupToken</td>
    <td valign="top">Copies a backup identified by backupToken (returned by backup/list) into a restorable Snapshot.</td>
  </tr>
  <tr>
    <td valign="top">ipv6/add</td>
    <td valign="top"></td>
    <td valign="top">Assigns a new IPv6 /64 subnet.<br><br><i style="color:#d0d0d0">Returns</i><br><b>assigned_subnet:</b> Newly assigned IPv6 /64 subnet</td>
  </tr>
  <tr>
    <td valign="top">ipv6/delete</td>
    <td valign="top">ip</td>
    <td valign="top">Releases specified IPv6 /64 subnet.</td>
  </tr>
  <tr>
    <td valign="top">migrate/getLocations</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Return all possible migration locations.<br><br><i style="color:#d0d0d0">Returns</i><br><b>currentLocation:</b> ID of current location<br><b>locations:</b> IDs of locations available for migration into<br><b>descriptions:</b> Friendly descriptions of available locations<br><b>dataTransferMultipliers:</b> Some locations may offer more expensive bandwidth where monthly allowance will be lower. This array contains monthly data transfer allowance multipliers for each location.</td>
  </tr>
  <tr>
    <td valign="top">migrate/start</td>
    <td valign="top">location</td>
    <td valign="top">Start VPS migration to new location. Takes new location ID as input. Note that this will result in all IPv4 addresses to be replaced.<br><br><i style="color:#d0d0d0">Returns</i><br><b>notificationEmail:</b> E-mail address on file where notification will be sent once task is completed.<br><b>newIps:</b> Array of new IP addresses assigned to the VPS.</td>
  </tr>
  <tr>
    <td valign="top">cloneFromExternalServer</td>
    <td valign="top">externalServerIP,<br>externalServerSSHport,<br>externalServerRootPassword</td>
    <td valign="top">(OVZ only) Clone a remote server or VPS. See Migrate from another server for example on how this works.</td>
  </tr>
  <tr>
    <td valign="top">getSuspensionDetails</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Retrieve information related to service suspensions.<br><br><i style="color:#d0d0d0">Returns</i><br><b>suspension_count:</b> Number of times service was suspended in current calendar year<br><b>total_abuse_points:</b> Total abuse points accumulated in current calendar year<br><b>max_abuse_points:</b> Maximum abuse points allowed by plan in a calendar year<br><b>suspensions:</b> array of all outstanding issues along with supporing evidence of abuse. See example below.<br><b>evidence:</b> Full text of the complaint or more details about the issue<br><br>Sample output when service is suspended:<br>
      <pre>
    [suspensions] =&gt; Array
        (
            [0] =&gt; stdClass Object
                (
                    [record_id] =&gt; 11851         // Case ID, needed to unsuspend 
                                                 // the service via "unsuspend" API call
                    [flag] =&gt; copyright          // Type of abuse
                    [is_soft] =&gt; 1               // 0 = must contact support to unsuspend
                                                 // 1 = can unsuspend via API call
                    [evidence_record_id] =&gt; 2207 // Detailed abuse report ID (see below)
                    [abuse_points] =&gt; 100        // Each abuse incident increases total_abuse_points counter
                )
        )

    [evidence] =&gt; stdClass Object
        (
            [2207] =&gt; "Full text of abuse complaint here"
        )

    [suspension_count] =&gt; 2
    [total_abuse_points] =&gt; 200
    [max_abuse_points] =&gt; 1500
</pre>
    </td>
  </tr>
  <tr>
    <td valign="top">getPolicyViolations</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Retrieve information related to active policy violations.<br><br><i style="color:#d0d0d0">Returns</i><br><b>total_abuse_points:</b> Total abuse points accumulated in current calendar year<br><b>max_abuse_points:</b> Maximum abuse points allowed by plan in a calendar year<br><b>policy_violations:</b> array of all outstanding issues along with supporing evidence of abuse. See example below.<br><br>Sample output when there is an active policy violation:<br>
      <pre>
    [policy_violations] =&gt; Array
        (
            [0] =&gt; Array
                (
                    [record_id] =&gt; 14            // Case ID, for resolvePolicyViolation 
                    [timestamp] =&gt; 1571469818    // Unix timestamp when record was created
                    [suspend_at] =&gt; 1571599418   // Service will be suspended if not resolved by this time
                    [flag] =&gt; copyright          // Type of abuse
                    [is_soft] =&gt; 1               // 0 = must contact support to unsuspend
                                                 // 1 = can unsuspend via API call
                    [abuse_points] =&gt; 100        // Each abuse incident increases total_abuse_points counter
                    [evidence_data] =&gt;           // Details of violation (text)
                )

        )

    [total_abuse_points] =&gt; 200
    [max_abuse_points] =&gt; 1500
    [error] =&gt; 0
</pre>
    </td>
  </tr>
  <tr>
    <td valign="top">unsuspend</td>
    <td valign="top">record_id</td>
    <td valign="top">Clear abuse issue identified by record_id and unsuspend the VPS. Refer to getSuspensionDetails call for details.</td>
  </tr>
  <tr>
    <td valign="top">resolvePolicyViolation</td>
    <td valign="top">record_id</td>
    <td valign="top">Mark policy violation as resolved. This is required to avoid service suspension. Refer to getPolicyViolations call for details.</td>
  </tr>
  <tr>
    <td valign="top">getRateLimitStatus</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">When you perform too many API calls in a short amount of time, KiwiVM API may start dropping your requests for a few minutes. This call allows monitoring this matter.<br><br><i style="color:#d0d0d0">Returns</i><br><b>remaining_points_15min:</b> Number of "points" available to use in the current 15-minute interval<br><b>remaining_points_24h:</b> Number of "points" available to use in the current 24-hour interval</td>
  </tr>
  <tr>
    <td valign="top">privateIp/getAvailableIps</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Returns all available (free) IPv4 addresses which you can activate on VM<br><br><i style="color:#d0d0d0">Returns</i><br><b>available_ips:</b> Array of available private IP addresses.</td>
  </tr>
  <tr>
    <td valign="top">privateIp/assign</td>
    <td valign="top">ip (optional)</td>
    <td valign="top">Assign private IP address. If IP address not specified, a random address will be assigned.<br><br><i style="color:#d0d0d0">Returns</i><br><b>assigned_ips:</b> Array of successfully assigned private IP addresses</td>
  </tr>
  <tr>
    <td valign="top">privateIp/delete</td>
    <td valign="top">ip</td>
    <td valign="top">Delete private IP address.</td>
  </tr>
  <tr>
    <td valign="top">kiwivm/getNotificationPreferences</td>
    <td valign="top" style="color:#d0d0d0">none</td>
    <td valign="top">Returns all available notification settings, as well as their state<br><br><i style="color:#d0d0d0">Returns</i><br><b>email_preferences:</b> Array of available notifications and their state<br><b>notificationEmail:</b> Currently configured e-mail address where notifications are sent</td>
  </tr>
  <tr>
    <td valign="top">kiwivm/setNotificationPreferences</td>
    <td valign="top">json_notification_preferences (json formatted array, preference_id:0/1)</td>
    <td valign="top">Changes notification preferences<br><br><i style="color:#d0d0d0">Returns</i><br><b>submitted_email_preferences:</b> Array of submitted changes<br><b>updated_email_preferences:</b> Array of actually changed preferences<br><b>friendly_descriptions:</b> Friendly descriptions of all preferences</td>
  </tr>
</table>
