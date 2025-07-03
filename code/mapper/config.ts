export const config = new Map<string, Record<string, string>>();

config.set("mvnoSmsCharge", {
  "telgea_user_id": "soapenv:Envelope.soapenv:Body.sms:ChargeSMS.sms:UserID",
  "msisdn": "soapenv:Envelope.soapenv:Body.sms:ChargeSMS.sms:PhoneNumber",
  "sms_charges.0.message_id": "soapenv:Envelope.soapenv:Body.sms:ChargeSMS.sms:MessageID",
  "sms_charges.0.timestamp": "soapenv:Envelope.soapenv:Body.sms:ChargeSMS.sms:Timestamp",
  "sms_charges.0.amount": "soapenv:Envelope.soapenv:Body.sms:ChargeSMS.sms:ChargeAmount",
  "sms_charges.0.currency": "soapenv:Envelope.soapenv:Body.sms:ChargeSMS.sms:Currency"
});

config.set("mvnoDataUsage", {
  "telgea_user_id": "user_id",
  "msisdn": "msisdn",
  "usage_data.total_mb": "usage.data.total_mb",
  "usage_data.roaming_mb": "usage.data.roaming_mb",
  "usage_data.country": "usage.data.country",
  "usage_data.network_type": "network.type",
  "usage_data.provider_code": "network.provider_code",
  "billing_period.start": "usage.period.start",
  "billing_period.end": "usage.period.end"
});