import { AppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";

export class GetAppointmentsUseCase {
  constructor(private readonly repository: AppointmentRepository) {}

  async execute(): Promise<Appointment[]> {
    return await this.repository.findAll();
  }
}
