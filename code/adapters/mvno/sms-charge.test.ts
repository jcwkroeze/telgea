import { test, expect } from "bun:test";

import { MvnoSmsChargeAdapter } from "./sms-charge";

test("should return SMS charges in MVNO format", async () => {
  const adapter = new MvnoSmsChargeAdapter();
  const result = await adapter.fetchSmsCharges();

  expect(result).toHaveProperty("soapenv:Envelope");
  expect(result["soapenv:Envelope"]["soapenv:Body"]["sms:ChargeSMS"]).toMatchObject({
    "sms:UserID": "abc123",
    "sms:MessageID": "msg789",
    "sms:PhoneNumber": "+46701234567",
    "sms:Timestamp": "2025-04-01T12:30:00Z",
    "sms:ChargeAmount": 0.05,
    "sms:Currency": "EUR"
  });
});

test("should validate schema with valid object", () => {
  const adapter = new MvnoSmsChargeAdapter();
  const validObj = {
    "soapenv:Envelope": {
      "soapenv:Body": {
        "sms:ChargeSMS": {
          "sms:UserID": "abc123",
          "sms:PhoneNumber": "+46701234567",
          "sms:MessageID": "msg789",
          "sms:Timestamp": "2025-04-01T12:30:00Z",
          "sms:ChargeAmount": 0.05,
          "sms:Currency": "EUR"
        }
      }
    }
  };

  expect(() => adapter.validateSchema(validObj)).not.toThrow();
});

test("should throw when SOAP envelope is missing", () => {
  const adapter = new MvnoSmsChargeAdapter();
  const invalidObj = {};

  expect(() => adapter.validateSchema(invalidObj))
    .toThrow("Missing SOAP envelope");
});

test("should throw when SOAP body is missing", () => {
  const adapter = new MvnoSmsChargeAdapter();
  const invalidObj = {
    "soapenv:Envelope": {}
  };

  expect(() => adapter.validateSchema(invalidObj))
    .toThrow("Missing SOAP body");
});

test("should throw when SMS charge data is missing", () => {
  const adapter = new MvnoSmsChargeAdapter();
  const invalidObj = {
    "soapenv:Envelope": {
      "soapenv:Body": {}
    }
  };

  expect(() => adapter.validateSchema(invalidObj))
    .toThrow("Missing SMS charge data");
});

test("should throw when required fields are missing", () => {
  const adapter = new MvnoSmsChargeAdapter();

  const requiredFields = [
    "sms:UserID",
    "sms:PhoneNumber",
    "sms:MessageID",
    "sms:Timestamp",
    "sms:ChargeAmount",
    "sms:Currency"
  ] as const;

  type SmsChargeField = typeof requiredFields[number];

  for (const field of requiredFields) {
    const testObj = {
      "soapenv:Envelope": {
        "soapenv:Body": {
          "sms:ChargeSMS": {
            "sms:UserID": "abc123",
            "sms:PhoneNumber": "+46701234567",
            "sms:MessageID": "msg789",
            "sms:Timestamp": "2025-04-01T12:30:00Z",
            "sms:ChargeAmount": 0.05,
            "sms:Currency": "EUR"
          }
        }
      }
    };

    delete testObj["soapenv:Envelope"]["soapenv:Body"]["sms:ChargeSMS"][field as SmsChargeField];

    expect(() => adapter.validateSchema(testObj))
      .toThrow(`Missing required field: ${field}`);
  }
});
