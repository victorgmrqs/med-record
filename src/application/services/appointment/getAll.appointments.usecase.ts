import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { Appointment } from 'domain/entities/appointment/appointments';
import { injectable, inject } from 'tsyringe';

@injectable()
export class GetAllAppointmentsUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(): Promise<{ id: number; doctorId: number; patientId: number; appointmentDate: string }[]> {
    const appointments = await this.appointmentRepository.findAll();
    return Appointment.toArrayResponse(appointments);
  }
}
