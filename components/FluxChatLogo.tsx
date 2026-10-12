import { useId } from "react";

// Symbole FluxChat (charte v1.1, piste C « Échange ») : deux bulles qui se répondent.
// couleur : fonds clairs · negatif : fonds sombres · blanc : fonds bleus ou dégradés
type Variant = "couleur" | "negatif" | "blanc";

const BACK = "M6,6 L50,6 A26,26 0 0 1 50,58 L6,58 Z";
const FRONT = "M94,42 L50,42 A26,26 0 0 0 50,94 L94,94 Z";

export function FluxChatSymbol({
  className = "h-8 w-8",
  variant = "couleur",
  title = "FluxChat",
}: {
  className?: string;
  variant?: Variant;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const grad = `fcg-${uid}`;
  const mask = `fcm-${uid}`;
  const backFill = variant === "blanc" ? "#FFFFFF" : `url(#${grad})`;
  const frontFill = variant === "couleur" ? "#0F172A" : "#FFFFFF";

  return (
    <svg className={className} viewBox="6 6 88 88" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00C2FF" />
          <stop offset="1" stopColor="#0099FF" />
        </linearGradient>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="#fff" />
          <path d={FRONT} fill="#000" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
        </mask>
      </defs>
      <path fill={backFill} mask={`url(#${mask})`} d={BACK} />
      <path fill={frontFill} d={FRONT} />
    </svg>
  );
}

export default FluxChatSymbol;
