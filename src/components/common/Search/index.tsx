import React from "react";
import { IoSearchOutline } from "react-icons/io5";

import "./Search.scss";

interface SearchProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="search-input-wrapper">
      <IoSearchOutline className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Search;
