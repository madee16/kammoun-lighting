import { useEffect, useState } from 'react';

export function PageLoader({ isNavigating }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let t1;
    let t2;
    let t3;

    if (isNavigating) {
      setVisible(true);
      setProgress(20);

      t1 = setTimeout(() => {
        setProgress(68);
      }, 40);

      t2 = setTimeout(() => {
        setProgress(88);
      }, 100);
    } else if (visible) {
      setProgress(100);
      t3 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 260);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isNavigating, visible]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className={`route-loader${progress === 100 ? ' completing' : ''}`}
      aria-hidden="true"
    >
      <div
        className="route-loader-bar"
        style={{
          transform: `scaleX(${progress / 100})`,
        }}
      />
      <div className="route-loader-glow" />
    </div>
  );
}
