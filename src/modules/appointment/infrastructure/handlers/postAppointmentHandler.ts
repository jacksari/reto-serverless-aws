import { APIGatewayProxyHandler } from "aws-lambda";
import { PostAppointmentController } from "../controllers/PostAppointmentController";

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  return await PostAppointmentController.execute(body);
};
