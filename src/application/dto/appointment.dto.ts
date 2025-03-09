interface IBaseAppointment {
  doctorId: number;
  patientId: number;
  appointmentDate: string;
}

interface ICreateAppointmentDTO extends IBaseAppointment {}

interface IAppointmentResponse extends IBaseAppointment {
  id: number;
}
export interface IUpdateAppointmentDTO extends Partial<IBaseAppointment> {
  id: number;
}
export type CreateAppointmentRequestDTO = ICreateAppointmentDTO;
export type UpdateAppointmentRequestDTO = IUpdateAppointmentDTO;
export type AppointmentResponseDTO = IAppointmentResponse;
export type DeleteAppointmentRequestDTO = number;
export type FindAppointmentRequestDTO = number;
