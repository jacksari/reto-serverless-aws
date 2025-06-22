import { CountryISO } from "../value-objects/CountryISO";
import { v4 as uuidv4 } from "uuid";

export interface AppointmentProps {
  id: string;
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export class Appointment {
  public readonly id: string;
  public readonly insuredId: string;
  public readonly scheduleId: number;
  public readonly countryISO: CountryISO;
  public readonly status: "pending" | "completed" | "cancelled";
  public readonly createdAt: string;

  constructor(props: AppointmentProps) {
    this.id = props.id;
    this.insuredId = props.insuredId;
    this.scheduleId = props.scheduleId;
    this.countryISO = props.countryISO;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }

  static create(data: {
    insuredId: string;
    scheduleId: number;
    countryISO: CountryISO;
  }): Appointment {
    return new Appointment({
      id: uuidv4(),
      insuredId: data.insuredId,
      scheduleId: data.scheduleId,
      countryISO: data.countryISO,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  }
}
