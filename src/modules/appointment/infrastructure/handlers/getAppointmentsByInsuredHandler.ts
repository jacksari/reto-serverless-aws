import { APIGatewayProxyHandler } from "aws-lambda";
import { GetAppointmentsByInsuredController } from "../controllers/GetAppointmentsByInsuredController";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { insuredId } = event.pathParameters || {};
  const body = event.queryStringParameters || {};
  return await GetAppointmentsByInsuredController.execute({
    insuredId,
    ...body,
  });
};
