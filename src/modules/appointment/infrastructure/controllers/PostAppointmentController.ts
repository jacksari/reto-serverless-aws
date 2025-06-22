import { CreateAppointmentUseCase } from "../../application/usecases/CreateAppointmentUseCase";
import { validateDto } from "../../../../shared/utils/validateDto";
import { DynamoAppointmentRepository } from "../repositories/DynamoAppointmentRepository";
import { publishAppointmentToSNS } from "@/modules/appointment/infrastructure/services/sns/snsPublisher";
import { CreateAppointmentDto } from "../dtos/PostAppointmentControllerDto";

export class PostAppointmentController {
  static async execute(body: any) {
    const { instance: dto, errors } = await validateDto(
      CreateAppointmentDto,
      body
    );

    if (errors) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Datos inválidos",
          details: errors,
        }),
      };
    }

    try {
      const repository = new DynamoAppointmentRepository();
      const useCase = new CreateAppointmentUseCase(repository);

      const appointment = await useCase.execute(dto);

      // enviar el appointment a SNS
      await publishAppointmentToSNS(appointment);

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "Cita creada exitosamente",
          item: appointment,
        }),
      };
    } catch (error: any) {
      console.error("Error en PostAppointmentController:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error.message || "Error interno al crear la cita",
        }),
      };
    }
  }
}
