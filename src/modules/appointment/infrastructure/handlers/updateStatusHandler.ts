import { SQSEvent, SQSHandler } from "aws-lambda";
import { UpdateStatusController } from "../controllers/UpdateStatusController";

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const msg = JSON.parse(record.body);
    const detail = JSON.parse(msg.detail);

    await UpdateStatusController.execute(detail.id, "completed");

    console.log(`estado actualizado: ${detail.insuredId}`);
  }
};
