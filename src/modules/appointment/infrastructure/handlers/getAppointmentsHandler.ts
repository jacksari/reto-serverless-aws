import { APIGatewayProxyHandler } from "aws-lambda";
import { GetAppointmentsController } from "../controllers/GetAppointmentsController";

export const handler: APIGatewayProxyHandler = async () => {
  return await GetAppointmentsController.execute();
};
