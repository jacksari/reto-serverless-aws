import { DynamoAppointmentRepository } from "../repositories/DynamoAppointmentRepository";
import { GetAppointmentsByInsuredUseCase } from "../../application/usecases/GetAppointmentsByInsuredUseCase";
import { getAppointmentsByInsuredDto } from "../dtos/getAppointmentsByInsuredDto";
import { validateDto } from "../../../../shared/utils/validateDto";

export class GetAppointmentsByInsuredController {
  static async execute(body: any) {
    const { instance: dto, errors } = await validateDto(
      getAppointmentsByInsuredDto,
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
      const useCase = new GetAppointmentsByInsuredUseCase(repository);

      const appointments = await useCase.execute(dto.insuredId, dto.status);

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: `lista de citas del paciente ${dto.insuredId} ${
            dto.status ? `con estado ${dto.status}` : ""
          }`,
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
