import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({ region: "us-east-1" });

const QUEUE_URL = process.env.SQS_CONFORMIDAD_URL!;

interface CompletedAppointmentMessage {
  id: string;
  insuredId: string;
  scheduleId: number;
  countryISO: string;
  status?: string;
}

export async function sendAppointmentCompletedToSqs(
  data: CompletedAppointmentMessage
) {
  const message = {
    detail: JSON.stringify({
      id: data.id,
      insuredId: data.insuredId,
      scheduleId: data.scheduleId,
      countryISO: data.countryISO,
      status: data.status ?? "completed",
    }),
  };

  const command = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(message),
  });

  await sqs.send(command);

  console.log("sqs conformidad enviado:", message);
}
