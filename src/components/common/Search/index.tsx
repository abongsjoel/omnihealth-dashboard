import React, { type ComponentPropsWithoutRef } from "react";
import { IoSearchOutline } from "react-icons/io5";

import "./Search.scss";

type SearchProps = ComponentPropsWithoutRef<"input">;

const Search: React.FC<SearchProps> = ({
  placeholder = "Search...",
  ...rest
}) => {
  return (
    <div className="search-input-wrapper">
      <IoSearchOutline className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default Search;
