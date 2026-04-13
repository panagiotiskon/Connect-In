import { MDBIcon } from 'mdb-react-ui-kit';
import './SortingCard.scss';

const SortingCard = ({ sortingMethod, onSortChange }) => {
  return (
    <div className="sorting-card">
      <button
        className={`sorting-tab${sortingMethod === 'date' ? ' sorting-tab--active' : ''}`}
        onClick={() => onSortChange('date')}
      >
        <MDBIcon far icon="clock" />
        <span>Recent</span>
      </button>
      <button
        className={`sorting-tab${sortingMethod === 'relevance' ? ' sorting-tab--active' : ''}`}
        onClick={() => onSortChange('relevance')}
      >
        <MDBIcon fas icon="star" />
        <span>Top</span>
      </button>
    </div>
  );
};

export default SortingCard;
