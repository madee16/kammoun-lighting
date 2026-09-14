import { ShieldCheck } from 'lucide-react';
import { ADMIN_COPY } from '../../data/siteContent.js';

export function SetupNotice() {
  return (
    <main className="admin-shell">
      <section className="login-card setup-card">
        <ShieldCheck size={34} />
        <h1>{ADMIN_COPY.setupTitle}</h1>
        <p>{ADMIN_COPY.setupText}</p>
      </section>
    </main>
  );
}