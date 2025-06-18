import { useState } from "react";
import Input from "../Input";

import "./DropdownInput.scss";

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
  const [showDropdown, setShowDropDown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>();
  console.log({ selectedOption });

  const handleIconClick = () => {
    setShowDropDown((prev) => !prev);
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setShowDropDown(false);
  };

  return (
    <div className="dropdown_input">
      <Input
        id={id}
        {...rest}
        iconName={
          options && options?.length > 0
            ? showDropdown
              ? "chevron_up"
              : "chevron_down"
            : "none"
        }
        onIconClick={handleIconClick}
      />
      {showDropdown && options && options.length > 0 && (
        <section className="drop_container">
          {options.map((option) => (
            <div
              className="drop_option"
              onClick={() => handleOptionSelect(option)}
            >
              {option.value}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default DropdownInput;
