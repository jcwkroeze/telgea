/**
 * MVNO API response types.
 */

export interface MvnoResponse {
  telgeaResponseType: string;
}

export interface MvnoSmsChargeResponse extends MvnoResponse {
  'soapenv:Envelope': {
    'soapenv:Header': Record<string, unknown>;
    'soapenv:Body': {
      'sms:ChargeSMS': {
        'sms:UserID': string;
        'sms:PhoneNumber': string;
        'sms:MessageID': string;
        'sms:Timestamp': Date;
        'sms:ChargeAmount': number;
        'sms:Currency': string;
      };
    };
  };
}

export interface MvnoDataUsageResponse extends MvnoResponse {
  user_id: string;
  msisdn: string;
  usage: {
    data: {
      total_mb: number;
      roaming_mb: number;
      country: string;
    };
    period: {
      start: Date;
      end: Date;
    };
  };
  network: {
    type: string;
    provider_code: string;
  };
}