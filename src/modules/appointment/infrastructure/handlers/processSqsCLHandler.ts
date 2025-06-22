import { SQSEvent, SQSHandler } from "aws-lambda";
import { MysqlAppointmentRepository } from "../repositories/MysqlAppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";
import { sendAppointmentCompletedToSqs } from "../services/sqs/sendAppointmentCompletedToSqs";

export const handler: SQSHandler = async (event: SQSEvent) => {
  const repo = new MysqlAppointmentRepository();

  for (const record of event.Records) {
    try {
      const outer = JSON.parse(record.body);
      const body: Appointment = JSON.parse(outer.Message);

      //guardar en rds
      await repo.save({
        insuredId: body.insuredId,
        scheduleId: body.scheduleId,
        countryISO: body.countryISO,
        createdAt: body.createdAt,
        status: body.status,
      });

      // enviar a la cola
      await sendAppointmentCompletedToSqs({
        id: body.id,
        insuredId: body.insuredId,
        scheduleId: body.scheduleId,
        countryISO: body.countryISO,
      });
    } catch (error) {
      console.error("error al procesar mensaje SQS_PE:", error);
    }
  }
};
