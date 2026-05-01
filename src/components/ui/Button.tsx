type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  className = "",
  type = "button",
}: ButtonProps) {
  const base = "rounded-lg font-semibold transition-all duration-200 cursor-pointer";

  const variants = {
    primary:   "bg-epson-navy text-white hover:bg-[#002070] active:scale-95",
    secondary: "bg-epson-light text-epson-navy border border-epson-lighter hover:bg-epson-lighter",
    ghost:     "text-epson-navy hover:bg-epson-light",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}