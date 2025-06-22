"use client"

import Select from "react-select";

type Option = Record<"value" | "label", string>;

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Chọn danh mục...",
  ...props
}: {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
  [key: string]: any;
}) {
  // Chuyển đổi selected values thành options cho react-select
  const selectedOptions = options.filter(option => selected.includes(option.value));

  const handleChange = (selectedOptions: any) => {
    const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    onChange(values);
  };

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      classNamePrefix="react-select"
      styles={{
        control: (provided, state) => ({
          ...provided,
          borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--input))',
          boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
          '&:hover': {
            borderColor: 'hsl(var(--ring))'
          }
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected 
            ? 'hsl(var(--primary))' 
            : state.isFocused 
            ? 'hsl(var(--accent))' 
            : 'transparent',
          color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
          '&:hover': {
            backgroundColor: state.isSelected 
              ? 'hsl(var(--primary))' 
              : 'hsl(var(--accent))'
          }
        }),
        multiValue: (provided) => ({
          ...provided,
          backgroundColor: 'hsl(var(--secondary))',
          color: 'hsl(var(--secondary-foreground))'
        }),
        multiValueRemove: (provided) => ({
          ...provided,
          color: 'hsl(var(--muted-foreground))',
          '&:hover': {
            backgroundColor: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive-foreground))'
          }
        })
      }}
      {...props}
    />
  )
} 