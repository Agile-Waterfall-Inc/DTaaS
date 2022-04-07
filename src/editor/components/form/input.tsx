interface InputProps {
  label: string,
  value: any,
  disabled?: boolean,
  placeholder?: string,
  rest?: any[],
  onChange( e: any ): void
}

export const Input = ( { label, value, onChange, disabled = false, ...rest }: InputProps ): JSX.Element => (
  <label className="text-left">
    <span className="text-gray-600 dark:text-gray-300 text-xs">{label}</span>
    <input
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="p-2 border rounded-sm border-gray-200 w-full bg-gray-50 dark:bg-gray-900 disabled:text-gray-400 text-gray-900 dark:text-gray-100 text-sm"
      {...rest}
    />
  </label>
)
