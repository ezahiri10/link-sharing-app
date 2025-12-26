import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

interface ProfileInputsProps {
  firstName: string;
  lastName: string;
  email: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  errors: {
    firstName?: string;
    lastName?: string;
  };
}

export function ProfileInputs({
  firstName,
  lastName,
  email,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  errors,
}: ProfileInputsProps) {
  return (
    <Card className="space-y-3">
      <div className="grid sm:grid-cols-[240px_1fr] gap-3 sm:gap-4 items-start">
        <label className="text-xs text-[#737373] sm:pt-3">First name*</label>
        <Input
          label=""
          value={firstName}
          onChange={onFirstNameChange}
          placeholder="e.g. John"
          error={errors.firstName}
        />
      </div>

      <div className="grid sm:grid-cols-[240px_1fr] gap-3 sm:gap-4 items-start">
        <label className="text-xs text-[#737373] sm:pt-3">Last name*</label>
        <Input
          label=""
          value={lastName}
          onChange={onLastNameChange}
          placeholder="e.g. Appleseed"
          error={errors.lastName}
        />
      </div>

      <div className="grid sm:grid-cols-[240px_1fr] gap-3 sm:gap-4 items-start">
        <label className="text-xs text-[#737373] sm:pt-3">Email</label>
        <Input
          label=""
          value={email}
          onChange={onEmailChange}
          placeholder="e.g. email@example.com"
          type="email"
        />
      </div>
    </Card>
  );
}
