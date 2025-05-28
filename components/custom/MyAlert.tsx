import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MyAlertProps {
  title: string;
  description: string;
  className?: string;
}

export function MyAlert({ title, description, className = "" }: MyAlertProps) {
  return (
    <Alert
      className={`m-0 pt-.5 border-0 rounded-sm hover:bg-muted-foreground/10  ${className}`}
    >
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export default MyAlert;
