import { MDBIcon } from 'mdb-react-ui-kit';
import './SearchInput.scss';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  isLoading = false,
  className = '',
}) => {
  return (
    <div className={`search-input ${className}`}>
      <span className="search-input__icon">
        <MDBIcon fas icon="search" />
      </span>
      <input
        type="text"
        className="search-input__field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isLoading && <span className="search-input__spinner" />}
    </div>
  );
};

export default SearchInput;
