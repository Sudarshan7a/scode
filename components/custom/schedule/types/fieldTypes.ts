// Shared types for form field components
export type FormFieldData = Record<string, unknown>;

// Base field component props
export interface BaseFieldProps {
  register?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  setValue?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  errors?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
