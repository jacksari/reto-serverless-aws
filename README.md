# Serverless Framework Node API, AWS

## DEVELOPER: Jack SAri

### Deployment

Clonar repo:

```
git clone https://github.com/jacksari/reto-serverless-aws
```

Instalar dependencias:

```
npm install
```

Implementar serverless:

```
serverless deploy
```

Después de ejecutar la implementación, debería ver un resultado similar al siguiente:

```
Deploying "reto rimac" to stage "dev" (us-east-1)

✔ Service deployed to stack reto-rimac-dev (45s)

endpoint:
  POST - https://47h8blky25.execute-api.us-east-1.amazonaws.com/dev/appointments
  GET - https://47h8blky25.execute-api.us-east-1.amazonaws.com/dev/appointments/all
  GET - https://47h8blky25.execute-api.us-east-1.amazonaws.com/dev/appointments/{insuredId}
functions:
  postAppointment: reto-rimac-dev-postAppointment (2.7 MB)
  listAppointments: reto-rimac-dev-listAppointments (2.7 MB)
  getAppointmentsByInsured: reto-rimac-dev-getAppointmentsByInsured (2.7 MB)
  appointment_pe: reto-rimac-dev-appointment_pe (2.7 MB)
  appointment_cl: reto-rimac-dev-appointment_cl (2.7 MB)
  updateAppointmentStatus: reto-rimac-dev-updateAppointmentStatus (2.7 MB)
```

## Generar documentación con OpenApi

```
npx @redocly/openapi-cli preview-docs ./openapi/openapi.json
```

## Visualizar docs en OpenApi en ruta

```
http://127.0.0.1:8080
```

## Ejecutar tests

```bash
npx jest
```

## Tecnologías utilizados

- AWS
  1. Lambda
  2. DynamoDb
  3. SNS
  4. SQS
  5. EventBridge
  6. RDS
  7. Secrets Manager
- NodeJs
- Jest
- Typescript
- Serverless

## Demo

```
https://47h8blky25.execute-api.us-east-1.amazonaws.com/dev
```

## Uso

### Crear cita POST

Registro de citas, para su almacenamiento en las colas de aws

- **Endpoint:** `/appointments`
- **Método:** `POST`
- **Validación:** insuredId: string, scheduleId: number, countryISO enum('PE', 'CL')
- **Body de la solicitud:**

```json
{
  "insuredId": "00015",
  "scheduleId": 115,
  "countryISO": "PE"
}
```

- **Respuesta:**

```json
{
  "message": "lista de citas",
  "item": [
    {
      "insuredId": "00001",
      "createdAt": "2025-06-22T22:14:46.233Z",
      "scheduleId": 101,
      "id": "eccfa0db-fa33-4ea3-9884-4d7002daf6ca",
      "countryISO": "PE",
      "status": "pending"
    }
  ]
}
```

### Listado de citas por asegurado GET

Obtener los datos registrados en la tabla Appointments filtrado por asegurado (DynamoDB)

- **Endpoint:** `/appointments`
- **Método:** `GET`
- **Respuesta:**

```json
{
    "message": "lista de citas",
    "item": [
        ...
         {
            "insuredId": "00001",
            "createdAt": "2025-06-22T22:14:46.233Z",
            "scheduleId": 101,
            "id": "eccfa0db-fa33-4ea3-9884-4d7002daf6ca",
            "countryISO": "PE",
            "status": "pending"
        }
        ...
    ]
}
```

### Listado todas las citas GET

Obtener los datos registrados en la tabla Appointments (DynamoDB)

- **Endpoint:** `/appointments/:insuredId`
- **Método:** `GET`
- **query params:** `status` opcional
- **Respuesta:**

```json
{
  "message": "lista de citas del paciente 00015 con estado completed",
  "item": [
     ...
     {
            "insuredId": "00001",
            "createdAt": "2025-06-22T22:14:46.233Z",
            "scheduleId": 101,
            "id": "eccfa0db-fa33-4ea3-9884-4d7002daf6ca",
            "countryISO": "PE",
            "status": "pending"
        }
     ...
  ]
}
```

### Apis en postman

[Postman](https://documenter.getpostman.com/view/10645967/2sB2xBEqmy)

---

Proyecto creado por [@jacksari](https://github.com/jacksari)
