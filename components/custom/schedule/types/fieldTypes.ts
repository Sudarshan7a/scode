import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";

// Shared types for form field components
export type FormFieldData = Record<string, unknown>;

// Base field component props with proper typing
export interface BaseFieldProps<T extends FormFieldData = FormFieldData> {
  register?: UseFormRegister<T>;
  setValue?: UseFormSetValue<T>;
  errors?: FieldErrors<T>;
}
