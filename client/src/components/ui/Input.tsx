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
      <label className={`text-xs font-regular block ${error ? 'text-error' : 'text-text-dark'}`}>
        {label}
        {required && <span className="text-error">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-md border ${
            error 
              ? "border-error shadow-focus text-error" 
              : "border-border-default focus:shadow-focus focus:border-primary text-text-dark"
          } px-4 py-3 text-sm font-regular placeholder:text-text-gray focus:outline-none transition-all bg-white`}
        />
        {error && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-error">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
