import { XMLParser, XMLValidator } from "fast-xml-parser";
import type { MvnoSmsChargeResponse } from "../../types/mvno";

const MOCK_RESPONSE = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://provider.com/sms">
   <soapenv:Header/>
   <soapenv:Body>
      <sms:ChargeSMS>
         <sms:UserID>abc123</sms:UserID>
         <sms:PhoneNumber>+46701234567</sms:PhoneNumber>
         <sms:MessageID>msg789</sms:MessageID>
         <sms:Timestamp>2025-04-01T12:30:00Z</sms:Timestamp>
         <sms:ChargeAmount>0.05</sms:ChargeAmount>
         <sms:Currency>EUR</sms:Currency>
      </sms:ChargeSMS>
   </soapenv:Body>
</soapenv:Envelope>`;

export class MvnoSmsChargeAdapter {
  /**
   * Mock adapter that simulates fetching SMS charges from the MVNO"s SMS charge API
   */
  async fetchSmsCharges(userId: string): Promise<MvnoSmsChargeResponse> {
    const xmlResponse = MOCK_RESPONSE;
    this.validateXmlResponse(xmlResponse);
    const parsedResponse = this.parseResponse(xmlResponse);
    this.validateSchema(parsedResponse);
    return parsedResponse as MvnoSmsChargeResponse;
  }

  private validateXmlResponse(xml: string): void {
    const validationResult = XMLValidator.validate(xml);
    if (validationResult !== true) {
      throw new Error(`Invalid XML: ${validationResult.err.msg}`);
    }
  }

  private parseResponse(xml: string): Record<string, any> {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      removeNSPrefix: false,
      tagValueProcessor: (tagName, tagValue) => {
        if (tagName === "sms:Timestamp") {
          return new Date(tagValue);
        }
        if (tagName === "sms:PhoneNumber") {
          return null;
        }
        if (tagName === "sms:ChargeAmount") {
          return parseFloat(tagValue);
        }
        return null;
      }
    });
    const parsedObj = parser.parse(xml);
    return parsedObj;
  }

  private validateSchema(obj: any): void {
    if (!obj["soapenv:Envelope"]) {
      throw new Error("Missing SOAP envelope");
    }

    if (!obj["soapenv:Envelope"]["soapenv:Body"]) {
      throw new Error("Missing SOAP body");
    }

    const smsCharge = obj["soapenv:Envelope"]["soapenv:Body"]["sms:ChargeSMS"];
    if (!smsCharge) {
      throw new Error("Missing SMS charge data");
    }

    const requiredFields = [
      "sms:UserID",
      "sms:PhoneNumber",
      "sms:MessageID",
      "sms:Timestamp",
      "sms:ChargeAmount",
      "sms:Currency"
    ];

    for (const field of requiredFields) {
      if (!smsCharge[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }
}