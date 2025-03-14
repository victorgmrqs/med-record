interface IBasePatient {
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  sex: 'M' | 'F';
  height: number;
  weight: number;
  doctorId: number;
}

interface IUpdatePatientRequest extends Omit<Partial<IBasePatient>, 'email' | 'sex'> {
  id: number;
  name?: string;
  phoneNumber?: string;
  birthDate?: any;
  height?: number;
  weight?: number;
  doctorId?: number;
}

export interface IPatientResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  sex: 'M' | 'F';
  height: number;
  weight: number;
  doctorId: number;
}

export type PatientResponseDTO = IPatientResponse;
export type PatientRequestDTO = IBasePatient;
export type UpdatePatientRequestDTO = IUpdatePatientRequest;
export type CreatePatientRequestDTO = IBasePatient;
export type DeletePatientRequestDTO = number;
