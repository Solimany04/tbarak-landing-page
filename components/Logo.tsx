export const Logo = ({ className }: { className?: string }) => (
    <svg 
      viewBox="0 0 100 100" // Use your original viewBox
      className={className} 
      fill="currentColor"   // Crucial: This makes Tailwind's 'text-...' work
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paste your SVG path data here */}
      <path d="/vector.svg" />
    </svg>
  );