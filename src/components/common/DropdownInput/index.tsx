import { useEffect, useRef, useState } from "react";
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
  value,
  options,
  onChange,
  onBlur,
  ...rest
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showDropdown, setShowDropDown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(
    options ?? []
  );

  const handleIconClick = () => {
    setShowDropDown((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = selectedOption?.value ?? "";
    onChange(e);
    if (options && options.length > 0) {
      setShowDropDown(true);

      const newFiltered = options.filter((option) =>
        option.value.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(newFiltered);
    }
  };

  const handleOptionSelect = (option: Option) => {
    // simulate selecting an input value
    const fakeEvent = {
      target: {
        value: option.value,
        name: rest.name,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange(fakeEvent);
    setSelectedOption(option);
    setShowDropDown(false);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const isValid = options?.some(
      (option) => option.value.toLowerCase() === inputValue.toLowerCase()
    );

    if (!isValid) {
      // Delay clearing the input slightly to let DOM settle
      setTimeout(() => {
        const fakeEvent = {
          target: {
            value: "",
            name: rest.name,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(fakeEvent);
      }, 0);
    }

    if (onBlur) {
      onBlur(e);
    }

    setShowDropDown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown_input" ref={dropdownRef}>
      <Input
        id={id}
        value={value}
        iconName={
          options && options?.length > 0
            ? showDropdown
              ? "chevron_up"
              : "chevron_down"
            : "none"
        }
        onChange={handleInputChange}
        onIconClick={handleIconClick}
        onBlur={handleBlur}
        {...rest}
      />
      {showDropdown && options && options.length > 0 && (
        <section className="drop_container">
          {filteredOptions.map((option) => (
            <div
              className="drop_option"
              onClick={() => handleOptionSelect(option)}
              key={option.id}
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
