import { PackageSearch } from 'lucide-react';

export function EmptyState({ icon: Icon = PackageSearch, title, text }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <Icon size={22} />
      </span>
      <strong>{title}</strong>
      {text && <p>{text}</p>}
    </div>
  );
}