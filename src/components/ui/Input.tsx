type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
};

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
  required,
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2.5 rounded-lg border border-epson-lighter bg-white text-sm
          focus:outline-none focus:ring-2 focus:ring-epson-blue focus:border-transparent
          placeholder:text-gray-400 transition-all duration-200 ${className}`}
      />
    </div>
  );
}