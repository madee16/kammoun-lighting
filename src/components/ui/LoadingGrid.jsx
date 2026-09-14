export function LoadingGrid({ count = 6 }) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Chargement en cours">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <span className="skeleton skeleton-image" />
          <div className="skeleton-card-body">
            <span className="skeleton skeleton-line w40" />
            <span className="skeleton skeleton-line w85" />
            <span className="skeleton skeleton-line w60" />
          </div>
        </div>
      ))}
    </div>
  );
}