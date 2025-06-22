import { IsString, IsNumber, IsIn } from "class-validator";

export class CreateAppointmentDto {
  @IsString()
  insuredId: string;

  @IsNumber()
  scheduleId: number;

  @IsIn(["PE", "CL"])
  countryISO: string;

}
