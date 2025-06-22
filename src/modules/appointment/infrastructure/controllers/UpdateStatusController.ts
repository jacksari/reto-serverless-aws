import { UpdateStatusUseCase } from "../../application/usecases/UpdateAppointmentStatusUseCase";
import { DynamoAppointmentRepository } from "../repositories/DynamoAppointmentRepository";

export class UpdateStatusController {
  static async execute(id: string, status: "completed" | "cancelled") {
    try {
      const repository = new DynamoAppointmentRepository();
      const useCase = new UpdateStatusUseCase(repository);
      await useCase.execute(id, status);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Estado actualizado a ${status}` }),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error.message || "Error al actualizar estado",
        }),
      };
    }
  }
}
