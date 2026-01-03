import dotenv from "dotenv";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export async function loadSecrets() {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config();
  }

  const secretId = process.env.AWS_SECRET_ID;
  const region = process.env.AWS_REGION;

  if (!secretId || !region) return;

  const client = new SecretsManagerClient({ region });
  const res = await client.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );

  let raw = res.SecretString;
  if (!raw && res.SecretBinary) {
    raw = Buffer.from(res.SecretBinary, "base64").toString("utf8");
  }
  if (!raw) return;

  const json = JSON.parse(raw);

  for (const [k, v] of Object.entries(json)) {
    if (process.env[k] === undefined) process.env[k] = String(v);
  }
}
