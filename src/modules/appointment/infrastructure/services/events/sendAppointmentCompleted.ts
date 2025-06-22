import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const eventBridge = new EventBridgeClient(
  { region: 'us-east-1' }
);

export interface sendAppointmentCompletedDto {
  insuredId: string;
  scheduleId: number;
  countryISO: string;
}

export async function sendAppointmentCompletedEvent(
  dto: sendAppointmentCompletedDto
) {
  console.log("*** enviando evento ***", dto);

  try {
    const result = await eventBridge.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: "appointment.service",
            DetailType: "appointment.completed",
            EventBusName: "default",
            Detail: JSON.stringify({
              insuredId: dto.insuredId,
              scheduleId: dto.scheduleId,
              countryISO: dto.countryISO,
              status: "completed",
            }),
          },
        ],
      })
    );

    console.log("evento enviado:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("error enviar bridge:", error);
  }
}
