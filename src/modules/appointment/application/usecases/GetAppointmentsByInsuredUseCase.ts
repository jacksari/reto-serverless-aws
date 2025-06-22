import { AppointmentRepository } from "@/modules/appointment/domain/repositories/AppointmentRepository";
import { Appointment } from "@/modules/appointment/domain/entities/Appointment";

export class GetAppointmentsByInsuredUseCase {
  constructor(private readonly repository: AppointmentRepository) {}

  async execute(insuredId: string, status?: string): Promise<Appointment[]> {
    return await this.repository.findByInsuredId(insuredId, status);
  }
}
