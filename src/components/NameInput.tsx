import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const NameInput = ({ value, onChange }: NameInputProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="name" className="text-base font-medium">
        Your Name
      </Label>
      <Input
        id="name"
        type="text"
        placeholder="Enter your full name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-lg p-4 border-workshop-primary/20 focus:border-workshop-primary focus:ring-workshop-primary/20"
        maxLength={50}
      />
      <p className="text-sm text-muted-foreground">
        This will appear on your poster ({value.length}/50 characters)
      </p>
    </div>
  );
};