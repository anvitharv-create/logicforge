export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z"
        fill="url(#lg1)" opacity="0.15"
        stroke="url(#lg1)" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="7"
        fill="none" stroke="url(#lg2)" strokeWidth="1.2" />
      <circle cx="18"   cy="11"   r="2"   fill="#3B82F6" />
      <circle cx="24.5" cy="14.5" r="1.5" fill="#06B6D4" />
      <circle cx="24.5" cy="21.5" r="1.5" fill="#06B6D4" />
      <circle cx="18"   cy="25"   r="2"   fill="#10B981" />
      <circle cx="11.5" cy="21.5" r="1.5" fill="#06B6D4" />
      <circle cx="11.5" cy="14.5" r="1.5" fill="#06B6D4" />
      <line x1="18"   y1="13"   x2="18"   y2="11"   stroke="#3B82F6" strokeWidth="1" opacity="0.7" />
      <line x1="23"   y1="15.5" x2="24.5" y2="14.5" stroke="#06B6D4" strokeWidth="1" opacity="0.7" />
      <line x1="23"   y1="20.5" x2="24.5" y2="21.5" stroke="#06B6D4" strokeWidth="1" opacity="0.7" />
      <line x1="18"   y1="23"   x2="18"   y2="25"   stroke="#10B981" strokeWidth="1" opacity="0.7" />
      <line x1="13"   y1="20.5" x2="11.5" y2="21.5" stroke="#06B6D4" strokeWidth="1" opacity="0.7" />
      <line x1="13"   y1="15.5" x2="11.5" y2="14.5" stroke="#06B6D4" strokeWidth="1" opacity="0.7" />
      <circle cx="18" cy="18" r="2.5" fill="url(#lg1)" />
      <circle cx="18" cy="18" r="1"   fill="white" opacity="0.9" />
    </svg>
  )
}