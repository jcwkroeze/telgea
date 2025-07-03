import type { MvnoDataUsageResponse } from "../../types/mvno";

const MOCK_RESPONSE = {
  "user_id": "abc123",
  "msisdn": "+46701234567",
  "usage": {
    "data": {
      "total_mb": 845.23,
      "roaming_mb": 210.50,
      "country": "SE"
    },
    "period": {
      "start": "2025-04-01T00:00:00Z",
      "end": "2025-04-30T23:59:59Z"
    }
  },
  "network": {
    "type": "4G",
    "provider_code": "SE01"
  }
};

export class MvnoUserDataUsageAdapter {
  /**
   * Mock adapter that simulates fetching data usage from the MVNO's REST API
   */
  async fetchUserDataUsage(): Promise<MvnoDataUsageResponse> {
    const response = MOCK_RESPONSE;
    this.validateResponse(response);
    return response;
  }

  validateResponse(response: unknown): asserts response is MvnoDataUsageResponse {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response: expected an object');
    }

    const obj = response as Partial<MvnoDataUsageResponse>;

    // Check required top-level fields
    if (!obj.user_id) throw new Error('Missing required field: user_id');
    if (!obj.msisdn) throw new Error('Missing required field: msisdn');
    if (!obj.usage) throw new Error('Missing required field: usage');
    if (!obj.network) throw new Error('Missing required field: network');

    // Check nested objects
    if (!obj.usage.data) throw new Error('Missing required field: usage.data');
    if (!obj.usage.period) throw new Error('Missing required field: usage.period');

    // Check data usage fields
    if (obj.usage.data.total_mb === undefined) throw new Error('Missing required field: usage.data.total_mb');
    if (obj.usage.data.roaming_mb === undefined) throw new Error('Missing required field: usage.data.roaming_mb');
    if (!obj.usage.data.country) throw new Error('Missing required field: usage.data.country');

    // Check period fields
    if (!obj.usage.period.start) throw new Error('Missing required field: usage.period.start');
    if (!obj.usage.period.end) throw new Error('Missing required field: usage.period.end');

    // Check network fields
    if (!obj.network.type) throw new Error('Missing required field: network.type');
    if (!obj.network.provider_code) throw new Error('Missing required field: network.provider_code');
  }
}