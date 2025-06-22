import { AppointmentRepository } from "../../domain/repositories/AppointmentRepository";

export class UpdateStatusUseCase {
  constructor(private readonly repository: AppointmentRepository) {}

  async execute(id: string, status: "completed" | "cancelled") {
    return this.repository.updateStatusById(id, status);
  }
}