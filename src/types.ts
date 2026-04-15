export interface KiwiVMResponse {
  error: number;
  message?: string;
}

export class KiwiVMError extends Error {
  public readonly errorCode: number;
  public readonly rawResponse: KiwiVMResponse;

  constructor(message: string, errorCode: number, rawResponse: KiwiVMResponse) {
    super(message);
    this.name = "KiwiVMError";
    this.errorCode = errorCode;
    this.rawResponse = rawResponse;
  }
}

export interface ServiceInfo extends KiwiVMResponse {
  hostname?: string;
  node_alias?: string;
  node_location?: string;
  location_ipv6_ready?: number;
  plan?: string;
  plan_monthly_data?: number;
  plan_disk?: number;
  plan_ram?: number;
  plan_swap?: number;
  os?: string;
  email?: string;
  data_counter?: number;
  data_next_reset?: number;
  ip_addresses?: string[];
  private_ip_addresses?: string[];
  ip_nullroutes?: Record<
    string,
    {
      nullroute_timestamp: number;
      nullroute_duration_s: number;
      log: string;
    }
  >;
  iso1?: string;
  iso2?: string;
  available_isos?: string[];
  plan_max_ipv6s?: number;
  rdns_api_available?: number;
  plan_private_network_available?: number;
  location_private_network_available?: number;
  ptr?: Record<string, string>;
  suspended?: number;
  policy_violation?: number;
  suspension_count?: number;
  total_abuse_points?: number;
  max_abuse_points?: number;
}

export interface LiveServiceInfo extends ServiceInfo {
  vm_type?: "ovz" | "kvm";
  vz_status?: Record<string, unknown>;
  vz_quota?: Record<string, unknown>;
  ve_status?: "Starting" | "Running" | "Stopped";
  ve_mac1?: string;
  ve_used_disk_space_b?: number;
  ve_disk_quota_gb?: number;
  is_cpu_throttled?: number;
  is_disk_throttled?: number;
  ssh_port?: number;
  live_hostname?: string;
  load_average?: string;
  mem_available_kb?: number;
  swap_total_kb?: number;
  swap_available_kb?: number;
  screendump_png_base64?: string;
}

export interface Snapshot {
  fileName: string;
  os: string;
  description: string;
  size: number;
  md5: string;
  sticky: number;
  purgesIn: number;
  downloadLink: string;
  downloadLinkSSL: string;
}

export interface Backup {
  backupToken: string;
  size: number;
  os: string;
  md5: string;
  timestamp: number;
}
