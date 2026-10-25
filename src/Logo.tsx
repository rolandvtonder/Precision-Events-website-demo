import { ACCENT, INK } from './content'

/*
  Temporary mark: the round knife-fork-spoon badge printed on the team's
  uniforms, redrawn as a vector. Swap for the real logo when it exists.
*/
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="13" fill={ACCENT} />
      <g stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(-0.8 0)">
        {/* fork */}
        <path d="M8.5 7v4.2c0 1 .7 1.8 1.6 1.8s1.6-.8 1.6-1.8V7M10.1 7v3.6M10.1 13v8" />
        {/* knife */}
        <path d="M14.4 21V7.2c1.5.9 2.1 3.2 2.1 5.4 0 .9-.7 1.5-2.1 1.5" />
        {/* spoon */}
        <ellipse cx="19.8" cy="9.6" rx="1.7" ry="2.5" />
        <path d="M19.8 12.1V21" />
      </g>
    </svg>
  )
}
