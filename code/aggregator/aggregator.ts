import { UserDatabase } from "../database/user-database";
import { CollectorFactory } from "../collectors/collector-factory";
import type { NormalizedUserData } from "../normalizer";

export class Aggregator {
  private userDatabase: UserDatabase;

  constructor() {
    this.userDatabase = new UserDatabase();
  }

  async getUserData(userId: string): Promise<NormalizedUserData> {
    try {
      const serviceId = await this.userDatabase.getServiceForUser(userId);
      const collector = CollectorFactory.getCollectorForType(serviceId);
      const partialResults = await collector.collectUserData(userId);
      return this.mergeUserData(partialResults);

    } catch (error) {
      throw new Error(`Failed to aggregate user data: ${error}`);
    }
  }

  mergeUserData(data: Partial<NormalizedUserData>[]): NormalizedUserData {
    if (data.length === 0) {
      throw new Error("No data to merge");
    }

    const result = { ...data[0] };

    for (const item of data.slice(1)) {
      if (item.sms_charges && item.sms_charges.length > 0) {
        if (!result.sms_charges) {
          result.sms_charges = [];
        }
        result.sms_charges.push(...item.sms_charges);
      }

      if (item.usage_data && !result.usage_data) {
        result.usage_data = item.usage_data;
      }

      if (item.billing_period && !result.billing_period) {
        result.billing_period = item.billing_period;
      }

      if (item.telgea_user_id && !result.telgea_user_id) {
        result.telgea_user_id = item.telgea_user_id;
      }

      if (item.msisdn && !result.msisdn) {
        result.msisdn = item.msisdn;
      }
    }

    this.validateNormalizedData(result);

    return result as NormalizedUserData;
  }

  private validateNormalizedData(data: Partial<NormalizedUserData>): void {
    if (!data.telgea_user_id) throw new Error("Missing required field: telgea_user_id");
    if (!data.msisdn) throw new Error("Missing required field: msisdn");

    if (!data.usage_data) throw new Error("Missing required field: usage_data");
    const usage = data.usage_data;
    if (usage.total_mb === undefined) throw new Error("Missing required field: usage_data.total_mb");
    if (usage.roaming_mb === undefined) throw new Error("Missing required field: usage_data.roaming_mb");
    if (!usage.country) throw new Error("Missing required field: usage_data.country");
    if (!usage.network_type) throw new Error("Missing required field: usage_data.network_type");
    if (!usage.provider_code) throw new Error("Missing required field: usage_data.provider_code");

    if (!data.billing_period) throw new Error("Missing required field: billing_period");
    if (!data.billing_period.start) throw new Error("Missing required field: billing_period.start");
    if (!data.billing_period.end) throw new Error("Missing required field: billing_period.end");

    if (!data.sms_charges) throw new Error("Missing required field: sms_charges");
  }
}