function MarqueeList({ items, ghost }) {
  return (
    <ul aria-hidden={ghost || undefined}>
      {items.map((item) => (
        <li key={item}>
          <span className="marquee-text">{item}</span>
          <span className="marquee-sep" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

export function MarqueeStrip({ items, ariaLabel }) {
  return (
    <div className="marquee" role="region" aria-label={ariaLabel || 'Points forts du magasin'}>
      <div className="marquee-track">
        <MarqueeList items={items} />
        <MarqueeList items={items} ghost />
      </div>
    </div>
  );
}