import { LogIn, ShieldCheck } from 'lucide-react';
import { FormStatus } from '../ui/FormStatus.jsx';
import { ADMIN_COPY } from '../../data/siteContent.js';

export function AdminLoginGate({
  deviceUnlocked,
  devicePassphrase,
  setDevicePassphrase,
  deviceError,
  unlockDevice,
  session,
  email,
  setEmail,
  password,
  setPassword,
  signIn,
  status,
}) {
  if (!deviceUnlocked) {
    return (
      <main className="admin-shell">
        <form className="login-card" onSubmit={unlockDevice}>
          <span className="admin-logo">
            <ShieldCheck size={30} />
          </span>
          <div>
            <p className="eyebrow">{ADMIN_COPY.privateEyebrow}</p>
            <h1>{ADMIN_COPY.deviceTitle}</h1>
          </div>
          <p>{ADMIN_COPY.deviceText}</p>
          <input
            type="password"
            placeholder={ADMIN_COPY.devicePlaceholder}
            aria-label={ADMIN_COPY.devicePlaceholder}
            value={devicePassphrase}
            onChange={(event) => setDevicePassphrase(event.target.value)}
            required
          />
          <button className="primary-button" type="submit">
            <ShieldCheck size={18} />
            {ADMIN_COPY.deviceCta}
          </button>
          {deviceError && <FormStatus status={{ text: ADMIN_COPY.deviceDenied, type: 'error' }} />}
        </form>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <form className="login-card" onSubmit={signIn}>
          <span className="admin-logo">
            <ShieldCheck size={30} />
          </span>
          <div>
            <p className="eyebrow">{ADMIN_COPY.privateEyebrow}</p>
            <h1>{ADMIN_COPY.loginTitle}</h1>
          </div>
          <p>{ADMIN_COPY.loginText}</p>
          <input
            type="email"
            placeholder={ADMIN_COPY.emailPlaceholder}
            aria-label={ADMIN_COPY.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder={ADMIN_COPY.passwordPlaceholder}
            aria-label={ADMIN_COPY.passwordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="primary-button" type="submit">
            <LogIn size={18} />
            {ADMIN_COPY.loginCta}
          </button>
          <FormStatus status={status} />
        </form>
      </main>
    );
  }

  return null;
}
