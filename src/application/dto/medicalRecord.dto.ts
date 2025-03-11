interface IBaseMedicalRecord {
  doctorId: number;
  patientId: number;
  appointmentId: number;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
}
export interface ICreateMedicalRecordRequest extends IBaseMedicalRecord {}

export interface IUpdateMedicalRecordRequest
  extends Omit<Partial<IBaseMedicalRecord>, 'doctorId' | 'patientId' | 'appointmentId'> {
  id: number;
  doctorId?: number;
  patientId?: number;
  appointmentId?: number;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
}

interface IMedicalRecordResponse extends IBaseMedicalRecord {
  id: number;
}
export type MedicalRecordResponseDTO = IMedicalRecordResponse;
export type CreateMedicalRecordRequestDTO = ICreateMedicalRecordRequest;
export type UpdateMedicalRecordRequestDTO = IUpdateMedicalRecordRequest;
