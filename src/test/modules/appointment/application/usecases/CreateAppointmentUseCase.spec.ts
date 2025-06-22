import { CreateAppointmentUseCaseDto } from "@/modules/appointment/application/dtos/CreateAppointmentUseCaseDto";
import { CreateAppointmentUseCase } from "@/modules/appointment/application/usecases/CreateAppointmentUseCase";
import { Appointment } from "@/modules/appointment/domain/entities/Appointment";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/AppointmentRepository";

const mockRepository: jest.Mocked<AppointmentRepository> = {
  save: jest.fn(),
  findByInsuredId: jest.fn(),
  findAll: jest.fn(),
  updateStatusById: jest.fn()
};

describe("CreateAppointmentUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería crear una cita y guardar", async () => {
    const useCase = new CreateAppointmentUseCase(mockRepository);

    const dto: CreateAppointmentUseCaseDto = {
      insuredId: "00013",
      scheduleId: 114,
      countryISO: "PE",
    };

    const appointment = await useCase.execute(dto);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        insuredId: dto.insuredId,
        scheduleId: dto.scheduleId,
        countryISO: dto.countryISO,
        status: "pending",
      })
    );

    expect(appointment).toBeInstanceOf(Appointment);
    expect(appointment.insuredId).toBe(dto.insuredId);
  });
});
