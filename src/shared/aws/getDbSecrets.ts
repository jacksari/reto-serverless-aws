import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({});

export async function getDbSecrets() {
  const SECRET_ID = process.env.SECRET_ID!;
  const command = new GetSecretValueCommand({ SecretId: SECRET_ID });
  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error("claves no encontradas");
  }

  return JSON.parse(response.SecretString);
}
