interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  type?: string;
}

export function Input({ label, value, onChange, placeholder, required, error, type = "text" }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-[#333333] block">
        {label}
        {required && <span className="text-[#FF3939]">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border ${
            error 
              ? "border-[#FF3939] focus:ring-[#FF3939] focus:border-[#FF3939] text-[#FF3939]" 
              : "border-[#D9D9D9] focus:ring-[#633CFF] focus:border-[#633CFF] text-[#333333]"
          } px-4 py-3 text-sm placeholder:text-[#737373] focus:outline-none focus:ring-1 bg-[#FFFFFF]`}
        />
        {error && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#FF3939]">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
