import { test, expect } from "bun:test";
import { Mapper } from "./mapper";
import type { MvnoSmsChargeResponse, MvnoDataUsageResponse } from "../adapters/response";

test("should map SMS charge data to partial normalized format", () => {
  const mapper = new Mapper();

  const smsCharge: MvnoSmsChargeResponse = {
    "soapenv:Envelope": {
      "soapenv:Header": {},
      "soapenv:Body": {
        "sms:ChargeSMS": {
          "sms:UserID": "abc123",
          "sms:PhoneNumber": "+46701234567",
          "sms:MessageID": "msg789",
          "sms:Timestamp": new Date("2025-04-01T12:30:00Z"),
          "sms:ChargeAmount": 0.05,
          "sms:Currency": "EUR"
        }
      }
    },
    telgeaResponseType: "mvnoSmsCharge"
  };

  const result = mapper.map(smsCharge);

  expect(result).toMatchObject({
    telgea_user_id: "abc123",
    msisdn: "+46701234567",
    sms_charges: [
      {
        message_id: "msg789",
        timestamp: new Date("2025-04-01T12:30:00Z"),
        amount: 0.05,
        currency: "EUR"
      }
    ]
  });
});

test("should map data usage to partial normalized format", () => {
  const mapper = new Mapper();

  const dataUsage: MvnoDataUsageResponse = {
    user_id: "abc123",
    msisdn: "+46701234567",
    usage: {
      data: {
        total_mb: 845.23,
        roaming_mb: 210.50,
        country: "SE"
      },
      period: {
        start: new Date("2025-04-01T00:00:00Z"),
        end: new Date("2025-04-30T23:59:59Z")
      }
    },
    network: {
      type: "4G",
      provider_code: "SE01"
    },
    telgeaResponseType: "mvnoDataUsage"
  };

  const result = mapper.map(dataUsage);

  expect(result).toMatchObject({
    telgea_user_id: "abc123",
    msisdn: "+46701234567",
    usage_data: {
      total_mb: 845.23,
      roaming_mb: 210.50,
      country: "SE",
      network_type: "4G",
      provider_code: "SE01"
    },
    billing_period: {
      start: new Date("2025-04-01T00:00:00Z"),
      end: new Date("2025-04-30T23:59:59Z")
    }
  });
});
