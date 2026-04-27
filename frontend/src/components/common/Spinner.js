import './Spinner.scss';

const Spinner = ({ className = '', style }) => (
  <span
    className={`spinner${className ? ` ${className}` : ''}`}
    style={style}
    aria-hidden="true"
  />
);

export default Spinner;
