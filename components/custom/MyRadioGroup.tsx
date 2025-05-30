import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function MyRadioGroup({ lists }: { lists: string[] }) {
  return (
    <RadioGroup defaultValue="comfortable">
      {lists.map((item, index) => (
        <div className="flex items-center space-x-2" key={item}>
          <RadioGroupItem
            value={item}
            id={`r${index}`}
            className="bg-foreground/80"
          />
          <Label htmlFor={`r${index}`}>{item}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
export default MyRadioGroup;
