import { AppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";
import {
  CountryISO,
} from "../../domain/value-objects/CountryISO";
import { CreateAppointmentUseCaseDto } from "../dtos/CreateAppointmentUseCaseDto";

export class CreateAppointmentUseCase {
  constructor(private readonly repository: AppointmentRepository) {}

  async execute(dto: CreateAppointmentUseCaseDto): Promise<Appointment> {
    
    const appointment = Appointment.create({
      insuredId: dto.insuredId,
      scheduleId: dto.scheduleId,
      countryISO: dto.countryISO as CountryISO,
    });

    await this.repository.save(appointment);

    return appointment;
  }
}
