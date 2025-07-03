/**
 * Type definitions for MVNO provider API responses
 */

export interface MvnoSoapSmsResponse {
  'soapenv:Envelope': {
    'soapenv:Header': Record<string, unknown>;
    'soapenv:Body': {
      'sms:ChargeSMS': {
        'sms:UserID': string;
        'sms:PhoneNumber': string;
        'sms:MessageID': string;
        'sms:Timestamp': string;
        'sms:ChargeAmount': string;
        'sms:Currency': string;
      };
    };
  };
}

export interface MvnoRestUsageResponse {
  user_id: string;
  msisdn: string;
  usage: {
    data: {
      total_mb: number;
      roaming_mb: number;
      country: string;
    };
    period: {
      start: string;
      end: string;
    };
  };
  network: {
    type: string;
    provider_code: string;
  };
}