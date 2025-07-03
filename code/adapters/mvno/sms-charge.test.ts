import { test, expect } from "bun:test";

import { MvnoSmsChargeAdapter } from "./sms-charge";

test("should return SMS charges in MVNO format", async () => {
  const adapter = new MvnoSmsChargeAdapter();
  const result = await adapter.fetchSmsCharges("abc123");

  expect(result).toHaveProperty("soapenv:Envelope");
  expect(result["soapenv:Envelope"]["soapenv:Body"]["sms:ChargeSMS"]).toMatchObject({
    "sms:UserID": "abc123",
    "sms:MessageID": "msg789",
    "sms:PhoneNumber": "+46701234567",
    "sms:Timestamp": new Date("2025-04-01T12:30:00Z"),
    "sms:ChargeAmount": 0.05,
    "sms:Currency": "EUR"
  });
});