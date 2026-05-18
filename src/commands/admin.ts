import type { KiwiVMClient } from "../client.ts";

export async function suspensions(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("getSuspensionDetails");
}

export async function unsuspend(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const recordId = args[0];
  if (!recordId) {
    throw new Error("unsuspend requires a <record-id> argument");
  }
  return client.call("unsuspend", { record_id: recordId });
}

export async function violationsList(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("getPolicyViolations");
}

export async function violationsResolve(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const recordId = args[0];
  if (!recordId) {
    throw new Error("violations resolve requires a <record-id> argument");
  }
  return client.call("resolvePolicyViolation", { record_id: recordId });
}

export async function notificationsGet(
  _args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  return client.call("kiwivm/getNotificationPreferences");
}

export async function notificationsSet(
  args: string[],
  _flags: Record<string, string>,
  client: KiwiVMClient,
): Promise<unknown> {
  const prefs = args[0];
  if (!prefs) {
    throw new Error("notifications set requires a <json> argument");
  }
  return client.call("kiwivm/setNotificationPreferences", {
    json_notification_preferences: prefs,
  });
}
