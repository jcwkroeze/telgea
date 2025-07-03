Scenario: Integrating a New MVNO Provider
Telgea is onboarding a new MVNO (Mobile Virtual Network Operator) partner. Your task is to structure and partially implement the integration between the provider’s telecom API and Telgea’s internal API normalizer.	
You’ve been provided with example data to guide the integration:
SOAP API response – Example for SMS charging (mvno_soap_spec.xml):
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sms="http://provider.com/sms">
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
</soapenv:Envelope>


REST API response – Example for user data usage (mvno_rest_spec.json):
{
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
}


Internal normalized format – Target structure expected by Telgea’s normalizer (internal_api_format.json):
{
  "telgea_user_id": "abc123",
  "msisdn": "+46701234567",
  "usage_data": {
    "total_mb": 845.23,
    "roaming_mb": 210.50,
    "country": "SE",
    "network_type": "4G",
    "provider_code": "SE01"
  },
  "sms_charges": [
    {
      "message_id": "msg789",
      "timestamp": "2025-04-01T12:30:00Z",
      "amount": 0.05,
      "currency": "EUR"
    }
  ],
  "billing_period": {
    "start": "2025-04-01T00:00:00Z",
    "end": "2025-04-30T23:59:59Z"
  }
}
(You can mock these using your own dummy data or plain objects)
 Task
In your submission, you should include the following:
1. Architecture & Approach (Briefly)
Write a brief document outlining your approach to a full integration of this MVNO.


Explain your folder structure and any major assumptions or decisions.


2. Partial Implementation
Implement one or both of the following:
tA converter that maps SOAP responses from mvno_soap_spec.xml to internal_api_format.json


A converter that maps REST responses from mvno_rest_spec.json to internal_api_format.json
Use TypeScript and structure your work as you would in a real codebase.
3. Project Structure
Set up a small repo or folder structure using best practices for working in a mid-sized product team.

Notes
You may use any libraries, tools, or boilerplate you want.


You are not expected to complete the entire task. Prioritize what’s important and make smart trade-offs.


Your approach, creativity, and structure matter as much as the amount of code written.



Submission
Please send back a zipped folder, GitHub repo link, or Gist that includes:
Your code


Any mock data


A brief documentation outlining your approach



 How You’ll Be Evaluated
You’ll be scored on 5 parameters, each rated 1–5:
Technical Implementation – Typescript, Node.js, SOAP/REST handling, correctness


Architecture & Structure – Code organization, modularity, clarity


Project Management & Prioritization – Focus, trade-offs, awareness of time constraints


Creative Problem Solving – Smart mapping, flexible thinking in working with differing APIs


Clarity & Communication – Code comments, structure explanation, developer-friendliness

Btw, we’re not looking for a vibe coder. 
