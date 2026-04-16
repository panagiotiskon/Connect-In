import './SkeletonCard.scss';

const SkeletonCard = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="skeleton-card">
        <div className="skeleton-card__header">
          <div className="skeleton-avatar" />
          <div className="skeleton-lines">
            <div className="skeleton-line skeleton-line--name" />
            <div className="skeleton-line skeleton-line--date" />
          </div>
        </div>
        <div className="skeleton-line skeleton-line--body" />
        <div className="skeleton-line skeleton-line--body skeleton-line--short" />
      </div>
    ))}
  </>
);

export default SkeletonCard;
