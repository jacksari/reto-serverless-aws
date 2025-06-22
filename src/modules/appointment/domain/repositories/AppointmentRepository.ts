import { Appointment } from "../entities/Appointment";

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findByInsuredId(insuredId: string, status?: string): Promise<Appointment[]>;
  findAll(): Promise<Appointment[]>;
  updateStatusById(id: string, status: string): Promise<void>;
}
