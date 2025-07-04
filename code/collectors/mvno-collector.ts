import { MvnoSmsChargeAdapter } from "../adapters/mvno/sms-charge";
import { MvnoUserDataUsageAdapter } from "../adapters/mvno/user-data-usage";
import { Mapper } from "../mapper/mapper";
import type { NormalizedUserData } from "../normalizer";

export class MvnoCollector {
  private smsChargeAdapter: MvnoSmsChargeAdapter;
  private userDataUsageAdapter: MvnoUserDataUsageAdapter;
  private mapper: Mapper;

  constructor() {
    this.smsChargeAdapter = new MvnoSmsChargeAdapter();
    this.userDataUsageAdapter = new MvnoUserDataUsageAdapter();
    this.mapper = new Mapper();
  }

  async collectUserData(userId: string): Promise<Array<Partial<NormalizedUserData>>> {
    const results: Array<Partial<NormalizedUserData>> = [];

    try {
      const smsChargeResponse = await this.smsChargeAdapter.fetchSmsCharges();
      const mappedSmsCharge = this.mapper.map(smsChargeResponse);
      results.push(mappedSmsCharge);
    } catch (error) {
      console.warn(`Failed to fetch SMS charge data for user ${userId}:`, error);
    }

    try {
      const dataUsageResponse = await this.userDataUsageAdapter.fetchUserDataUsage();
      const mappedDataUsage = this.mapper.map(dataUsageResponse);
      results.push(mappedDataUsage);
    } catch (error) {
      console.warn(`Failed to fetch data usage for user ${userId}:`, error);
    }

    if (results.length === 0) {
      throw new Error(`No data could be retrieved for user ${userId}`);
    }

    return results;
  }
}