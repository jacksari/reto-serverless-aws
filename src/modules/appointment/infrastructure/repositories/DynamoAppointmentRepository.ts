import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Appointment } from "../../domain/entities/Appointment";
import { AppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { instanceToPlain } from "class-transformer";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMO_TABLE || "Appointments";

export class DynamoAppointmentRepository implements AppointmentRepository {
  async save(appointment: Appointment): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: instanceToPlain(appointment),
    };
    await db.send(new PutCommand(params));
  }

  async findByInsuredId(
    insuredId: string,
    status?: string
  ): Promise<Appointment[]> {
    console.log('dinamo params:', insuredId, status)
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: "InsuredIdIndex",
      KeyConditionExpression: "insuredId = :id",
      ExpressionAttributeValues: {
        ":id": insuredId,
      },
    };

    if (status) {
      params.FilterExpression = "#status = :status";
      params.ExpressionAttributeNames = {
        "#status": "status",
      };
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ":status": status,
      };
    }

    const result = await db.send(new QueryCommand(params));
    return result.Items as Appointment[];
  }

  async findAll(): Promise<Appointment[]> {
    const params = { TableName: TABLE_NAME };
    const result = await db.send(new ScanCommand(params));
    return result.Items as Appointment[];
  }

  async updateStatusById(id: string, status: "completed" | "cancelled") {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: { S: id },
      },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": { S: status },
      },
    };

    await client.send(new UpdateItemCommand(params));
  }
}
