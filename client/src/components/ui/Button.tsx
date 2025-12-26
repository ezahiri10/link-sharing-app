interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  type = "button", 
  disabled, 
  variant = "primary",
  fullWidth 
}: ButtonProps) {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold text-sm transition";
  
  const variantClasses = variant === "primary"
    ? "bg-[#633CFF] text-white hover:opacity-90 disabled:opacity-50"
    : "bg-white border border-[#633CFF] text-[#633CFF] hover:bg-[#EFEBFF]";
  
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${widthClass} disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
