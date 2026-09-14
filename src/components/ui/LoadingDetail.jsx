export function LoadingDetail() {
  return (
    <div className="detail-skeleton" aria-busy="true" aria-label="Chargement en cours">
      <span className="skeleton skeleton-block" />
      <div className="skeleton-card">
        <div className="skeleton-card-body">
          <span className="skeleton skeleton-line w30" />
          <span className="skeleton skeleton-line w80" />
          <span className="skeleton skeleton-line w60" />
          <span className="skeleton skeleton-line w70" />
          <span className="skeleton skeleton-line w50" />
        </div>
      </div>
    </div>
  );
}