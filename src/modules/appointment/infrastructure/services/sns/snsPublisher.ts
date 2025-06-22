import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});
const TOPIC_ARN = process.env.SNS_TOPIC_ARN!;

export async function publishAppointmentToSNS(message: any) {
  const command = new PublishCommand({
    TopicArn: TOPIC_ARN,
    Message: JSON.stringify(message),
    MessageAttributes: {
      countryISO: {
        DataType: "String",
        StringValue: message.countryISO,
      },
    },
  });

  console.log('enviado a sns para filtrar')

  await sns.send(command);
}
