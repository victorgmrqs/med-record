import { z } from 'zod';

export const doctorSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

interface IDoctorResponse {
  id: number;
  name: string;
  email: string;
}
export const getDoctorResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
});

export const getDoctorRequestSchema = z.object({
  id: z.number(),
});

export const updateDoctorRequestSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const createDoctorRequestSchema = doctorSchema;

export interface IDoctorDTO {
  name: string;
  email: string;
  password?: string;
}

export interface IGetDoctorRequestDTO {
  id: number;
}

export interface IUpdateDoctorRequestDTO {
  id: number;
  name?: string;
}

export type DoctorResponseDTO = {
  id: number;
  name: string;
  email: string;
};

export type CreateDoctorRequestDTO = IDoctorDTO;
export type DoctorResponse = IDoctorResponse;
