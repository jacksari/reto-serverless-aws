import { DynamoAppointmentRepository } from "../repositories/DynamoAppointmentRepository";
import { GetAppointmentsUseCase } from "../../application/usecases/GetAppointmentsUseCase";

export class GetAppointmentsController {
  static async execute() {
    try {
      const repository = new DynamoAppointmentRepository();
      const useCase = new GetAppointmentsUseCase(repository);

      const appointments = await useCase.execute();

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "lista de citas",
          item: appointments,
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
