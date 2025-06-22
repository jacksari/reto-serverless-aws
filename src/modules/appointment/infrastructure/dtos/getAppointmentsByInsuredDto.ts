import { IsString, IsIn, IsOptional } from "class-validator";

export class getAppointmentsByInsuredDto {
  @IsString()
  insuredId: string;

  @IsOptional()
  @IsIn(["pending", "completed", "cancelled"])
  status?: string;
}
