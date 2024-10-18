import React from "react";
import "./styles.scss";
import SearchIcon from "../icons/Search";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<Props> = (props) => {
  const { value, onChange, placeholder } = props;

  return (
    <section className="search-bar">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <SearchIcon />
    </section>
  );
};

export default SearchBar;
