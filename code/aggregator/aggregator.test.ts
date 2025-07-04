import { test, expect } from "bun:test";
import { Aggregator } from "./aggregator";

test("should return normalized user data for user abc123", async () => {
    const aggregator = new Aggregator();

    const result = await aggregator.getUserData("abc123");

    expect(result).toBeDefined();
    expect(result.telgea_user_id).toBe("abc123");
    expect(result.msisdn).toBe("+46701234567");

    expect(result.usage_data).toBeDefined();
    expect(result.usage_data.total_mb).toBe(845.23);
    expect(result.usage_data.roaming_mb).toBe(210.50);
    expect(result.usage_data.country).toBe("SE");
    expect(result.usage_data.network_type).toBe("4G");
    expect(result.usage_data.provider_code).toBe("SE01");

    expect(result.sms_charges).toBeArray();
    expect(result.sms_charges).toHaveLength(1);
    expect(result.sms_charges[0]?.message_id).toBe("msg789");
    expect(result.sms_charges[0]?.timestamp).toBe("2025-04-01T12:30:00Z");
    expect(result.sms_charges[0]?.amount).toBe(0.05);
    expect(result.sms_charges[0]?.currency).toBe("EUR");

    expect(result.billing_period).toBeDefined();
    expect(result.billing_period.start).toBe("2025-04-01T00:00:00Z");
    expect(result.billing_period.end).toBe("2025-04-30T23:59:59Z");
});