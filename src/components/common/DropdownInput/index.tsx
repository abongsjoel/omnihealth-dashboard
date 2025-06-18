import { useState } from "react";
import Input from "../Input";

interface Option {
  id: string;
  value: string;
}

interface DropdownInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  pattern?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Option[];
  className?: string;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  id,
  options,
  ...rest
}) => {
  const [_showDropdown, setShowDropDown] = useState(false);

  const handleIconClick = () => {
    setShowDropDown((prev) => !prev);
  };

  return (
    <div>
      <Input
        id={id}
        {...rest}
        iconName={
          options && options?.length > 0
            ? _showDropdown
              ? "chevron_up"
              : "chevron_down"
            : "none"
        }
        onIconClick={handleIconClick}
      />
    </div>
  );
};

export default DropdownInput;
