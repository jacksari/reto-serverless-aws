import mysql from "mysql2/promise";
import { getDbSecrets } from "../../../../shared/aws/getDbSecrets";

export class MysqlAppointmentRepository {
  async save(appointment: {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    createdAt: string;
    status: string;
  }) {
    //claves de rds
    const secrets = await getDbSecrets();

    const connection = await mysql.createConnection({
      host: secrets.host,
      user: secrets.user,
      password: secrets.password,
      database: secrets.db,
    });

    const { insuredId, scheduleId, countryISO, createdAt, status } =
      appointment;

    if (!insuredId || !scheduleId || !countryISO || !createdAt || !status) {
      throw new Error("campos vacios");
    }

    await connection.execute(
      `INSERT INTO appointments (insured_id, schedule_id, country_iso, created_at, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        appointment.insuredId,
        appointment.scheduleId,
        appointment.countryISO,
        appointment.createdAt,
        appointment.status,
      ]
    );

    await connection.end();

    console.log("guardado en rds");
  }
}
