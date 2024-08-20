import { STSClient, GetSessionTokenCommand } from "@aws-sdk/client-sts";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import CryptoJS from "crypto-js";
import moment from "moment";

export const SigV4Utils = {
  sign(key: string, msg: string) {
    const hash = CryptoJS.HmacSHA256(msg, key);
    return hash.toString(CryptoJS.enc.Hex);
  },

  sha256(msg: string) {
    const hash = CryptoJS.SHA256(msg);
    return hash.toString(CryptoJS.enc.Hex);
  },

  getSignatureKey(
    key: string,
    dateStamp: string,
    regionName: string,
    serviceName: string
  ) {
    const kDate = CryptoJS.HmacSHA256(dateStamp, `AWS4${key}`);
    const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    const kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
    return kSigning;
  },

  async createEndpoint(
    regionName: string,
    awsIotEndpoint: string,
    accessKey: string,
    secretKey: string
  ) {
    // Check if parameters are not null or undefined
    if (!regionName || !awsIotEndpoint || !accessKey || !secretKey) {
      throw new Error(
        "One or more parameters are missing for endpoint creation."
      );
    }

    const stsClient = new STSClient({ credentials: fromEnv() });

    try {
      const sessionToken = await stsClient.send(new GetSessionTokenCommand({}));

      const time = moment.utc();
      const dateStamp = time.format("YYYYMMDD");
      const amzdate = `${dateStamp}T${time.format("HHmmss")}Z`;
      const service = "iotdevicegateway";
      const algorithm = "AWS4-HMAC-SHA256";
      const method = "GET";
      const canonicalUri = "/mqtt";
      const host = awsIotEndpoint;
      const credentialScope = `${dateStamp}/${regionName}/${service}/aws4_request`;

      let canonicalQuerystring = "X-Amz-Algorithm=AWS4-HMAC-SHA256";
      canonicalQuerystring += `&X-Amz-Credential=${encodeURIComponent(
        `${accessKey}/${credentialScope}`
      )}`;
      canonicalQuerystring += `&X-Amz-Date=${amzdate}`;
      canonicalQuerystring += "&X-Amz-SignedHeaders=host";

      const canonicalHeaders = `host:${host}\n`;
      const payloadHash = SigV4Utils.sha256("");
      const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\nhost\n${payloadHash}`;

      const stringToSign = `${algorithm}\n${amzdate}\n${credentialScope}\n${SigV4Utils.sha256(
        canonicalRequest
      )}`;
      const signingKey = SigV4Utils.getSignatureKey(
        secretKey,
        dateStamp,
        regionName,
        service
      );
      const signature = SigV4Utils.sign(signingKey.toString(), stringToSign);

      canonicalQuerystring += `&X-Amz-Signature=${signature}`;

      // Ensure sessionToken is properly defined
      if (sessionToken && sessionToken.Credentials) {
        const sessionTokenValue = sessionToken.Credentials.SessionToken || "";
        canonicalQuerystring += `&X-Amz-Security-Token=${encodeURIComponent(
          sessionTokenValue
        )}`;
      } else {
        console.error(
          "sessionToken or sessionToken.Credentials is not available."
        );
      }

      console.log(
        `Generated endpoint URL: wss://${host}${canonicalUri}?${canonicalQuerystring}`
      );
      return `wss://${host}${canonicalUri}?${canonicalQuerystring}`;
    } catch (error) {
      console.error("Error generating endpoint URL:", error);
      throw error;
    }
  },
};
