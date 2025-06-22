import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "reto-rimac",
  frameworkVersion: "^4.0.0",
  // plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "us-east-1",
    environment: {
      DYNAMO_TABLE: "Appointments",
      SNS_TOPIC_ARN: {
        Ref: "SNSTopic",
      },
      SQS_CONFORMIDAD_URL: {
        "Fn::GetAtt": ["SQSConformidad", "QueueUrl"],
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:*", "sns:*", "sqs:*", "events:*"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["secretsmanager:GetSecretValue"],
            Resource:
              "arn:aws:secretsmanager:us-east-1:481559741397:secret:/prod/db/appointments/rds*",
          },
        ],
      },
    },
  },
  functions: {
    postAppointment: {
      handler:
        "src/modules/appointment/infrastructure/handlers/postAppointmentHandler.handler",
      events: [{ http: { method: "post", path: "appointments" } }],
    },
    listAppointments: {
      handler:
        "src/modules/appointment/infrastructure/handlers/getAppointmentsHandler.handler",
      events: [
        {
          http: {
            method: "get",
            path: "appointments/all",
          },
        },
      ],
    },
    getAppointmentsByInsured: {
      handler:
        "src/modules/appointment/infrastructure/handlers/getAppointmentsByInsuredHandler.handler",
      events: [{ http: { method: "get", path: "appointments/{insuredId}" } }],
    },
    appointment_pe: {
      handler:
        "src/modules/appointment/infrastructure/handlers/processSqsPEHandler.handler",
      events: [
        {
          sqs: {
            arn: { "Fn::GetAtt": ["SQSPe", "Arn"] },
          },
        },
      ],
      environment: {
        SECRET_ID: "/prod/db/appointments/rds",
      },
    },
    appointment_cl: {
      handler:
        "src/modules/appointment/infrastructure/handlers/processSqsCLHandler.handler",
      events: [
        {
          sqs: {
            arn: { "Fn::GetAtt": ["SQSCl", "Arn"] },
          },
        },
      ],
      environment: {
        SECRET_ID: "/prod/db/appointments/rds",
      },
    },
    updateAppointmentStatus: {
      handler:
        "src/modules/appointment/infrastructure/handlers/updateStatusHandler.handler",
      events: [
        {
          sqs: {
            arn: { "Fn::GetAtt": ["SQSConformidad", "Arn"] },
          },
        },
      ],
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: "node18",
      platform: "node",
      external: ["events"],
      copyFiles: [{ from: "swagger/swagger.json", to: "swagger.json" }],
    },
  },
  resources: {
    Resources: {
      AppointmentsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Appointments",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
        },
      },

      // SNS Topic
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "AppointmentTopic",
        },
      },

      // SQS cola para Perú
      SQSPe: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQS_PE",
        },
      },

      // SQS cola para Chile
      SQSCl: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQS_CL",
        },
      },

      // suscripcion SNS → SQS_PE, filtro para peru
      SNSToSQSPE: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          TopicArn: { Ref: "SNSTopic" },
          Protocol: "sqs",
          Endpoint: { "Fn::GetAtt": ["SQSPe", "Arn"] },
          FilterPolicy: {
            countryISO: ["PE"],
          },
        },
      },

      // suscripcion SNS → SQS_CL, filtro para chile
      SNSToSQSCL: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          TopicArn: { Ref: "SNSTopic" },
          Protocol: "sqs",
          Endpoint: { "Fn::GetAtt": ["SQSCl", "Arn"] },
          FilterPolicy: {
            countryISO: ["CL"],
          },
        },
      },

      // permisos para enviar sns a colas
      SQSPePolicy: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSPe" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: "*",
                Action: "sqs:SendMessage",
                Resource: { "Fn::GetAtt": ["SQSPe", "Arn"] },
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": { Ref: "SNSTopic" },
                  },
                },
              },
            ],
          },
        },
      },

      SQSClPolicy: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSCl" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: "*",
                Action: "sqs:SendMessage",
                Resource: { "Fn::GetAtt": ["SQSCl", "Arn"] },
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": { Ref: "SNSTopic" },
                  },
                },
              },
            ],
          },
        },
      },

      SQSConformidad: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQS_Conformidad",
        },
      },

      // Creacion del bridge
      AppointmentCompletedRule: {
        Type: "AWS::Events::Rule",
        Properties: {
          Name: "AppointmentCompletedRule",
          EventPattern: {
            source: ["appointment.service"],
            detailType: ["appointment.completed"],
          },
          Targets: [
            {
              Arn: { "Fn::GetAtt": ["SQSConformidad", "Arn"] },
              Id: "TargetSQSConformidad",
            },
          ],
        },
      },

      // permiso del bridge
      SQSConformidadPolicy: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSConformidad" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "AllowEventBridgeToSendMessage",
                Effect: "Allow",
                Principal: {
                  Service: "events.amazonaws.com",
                },
                Action: "sqs:SendMessage",
                Resource: "arn:aws:sqs:us-east-1:481559741397:SQS_Conformidad",
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
