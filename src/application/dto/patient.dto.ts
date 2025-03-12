interface IBasePatient {
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  sex: 'M' | 'F';
  height: number;
  weight: number;
}

export interface IPatientResponse extends IBasePatient {
  id: number;
}
interface IUpdateDoctorRequest extends IBasePatient {
  id: number;
}

interface IUpdatePatientRequest extends Omit<Partial<IBasePatient>, 'email' | 'sex'> {
  id: number;
  name?: string;
  phoneNumber?: string;
  birthDate?: any;
  height?: number;
  weight?: number;
}

export type PatientResponseDTO = IPatientResponse;
export type PatientRequestDTO = IBasePatient;
export type UpdatePatientRequestDTO = IUpdatePatientRequest;
export type CreatePatientRequestDTO = IBasePatient;
export type DeletePatientRequestDTO = number;
