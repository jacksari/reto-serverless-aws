import { GetAppointmentsByInsuredUseCase } from "@/modules/appointment/application/usecases/GetAppointmentsByInsuredUseCase";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/AppointmentRepository";
import { Appointment } from "@/modules/appointment/domain/entities/Appointment";

const mockRepository: jest.Mocked<AppointmentRepository> = {
  save: jest.fn(),
  findByInsuredId: jest.fn(),
  findAll: jest.fn(),
};

describe("GetAppointmentsByInsuredUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería retornar citas del asegurado con status opcional", async () => {
    const useCase = new GetAppointmentsByInsuredUseCase(mockRepository);

    const fakeAppointments: Appointment[] = [
      {
        insuredId: "00003",
        scheduleId: 103,
        createdAt: "2025-06-21T05:46:08.071Z",
        countryISO: "PE",
        status: "completed",
      },
    ];

    mockRepository.findByInsuredId.mockResolvedValue(fakeAppointments);

    const result = await useCase.execute("00003", "completed");

    expect(mockRepository.findByInsuredId).toHaveBeenCalledWith(
      "00003",
      "completed"
    );
    expect(result).toEqual(fakeAppointments);
  });

  it("debería retornar citas del asegurado sin filtrar por status", async () => {
    const useCase = new GetAppointmentsByInsuredUseCase(mockRepository);

    const appointments: Appointment[] = [
      {
        insuredId: "00003",
        scheduleId: 103,
        createdAt: "2025-06-21T05:46:08.071Z",
        countryISO: "PE",
        status: "completed",
      },
    ];

    mockRepository.findByInsuredId.mockResolvedValue(appointments);

    const result = await useCase.execute("00003");

    expect(mockRepository.findByInsuredId).toHaveBeenCalledWith(
      "00003",
      undefined
    );
    expect(result).toEqual(appointments);
  });
});
