import { test, expect } from "bun:test";
import { MvnoUserDataUsageAdapter } from "./user-data-usage";

test("should return data usage in MVNO format", async () => {
  const adapter = new MvnoUserDataUsageAdapter();
  const result = await adapter.fetchUserDataUsage();

  expect(result).toMatchObject({
    user_id: "abc123",
    msisdn: "+46701234567",
    usage: {
      data: {
        total_mb: 845.23,
        roaming_mb: 210.50,
        country: "SE"
      },
      period: {
        start: "2025-04-01T00:00:00Z",
        end: "2025-04-30T23:59:59Z"
      }
    },
    network: {
      type: "4G",
      provider_code: "SE01"
    }
  });
});

test("should throw error when validating invalid response", () => {
  const adapter = new MvnoUserDataUsageAdapter();

  expect(() => adapter.validateResponse({
    msisdn: "+46701234567",
    usage: { data: {}, period: {} },
    network: {}
  })).toThrow("Missing required field: user_id");

  expect(() => adapter.validateResponse({
    user_id: "abc123",
    msisdn: "+46701234567",
    usage: {
      data: { total_mb: 100, roaming_mb: 0, country: "SE" },
      period: { start: "2025-04-01T00:00:00Z", end: "2025-04-30T23:59:59Z" }
    },
    network: { provider_code: "SE01" }
  })).toThrow("Missing required field: network.type");
});