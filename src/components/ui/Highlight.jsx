export function Highlight({ text, words = [] }) {
  if (!words.length) return text;

  const escaped = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

  return String(text)
    .split(pattern)
    .map((part, index) =>
      index % 2 === 1 ? (
        <mark className="hl" key={index}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
}