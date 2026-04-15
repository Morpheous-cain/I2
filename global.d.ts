/// <reference types="react" />
/// <reference types="react-dom" />

// Silence lucide-react missing types
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  export type LucideIcon = FC<SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string }>
  const icons: Record<string, LucideIcon>
  export const ArrowRight: LucideIcon
  export const ChevronDown: LucideIcon
  export const Menu: LucideIcon
  export const X: LucideIcon
  export const Zap: LucideIcon
  export const Cloud: LucideIcon
  export const Layers: LucideIcon
  export const Globe: LucideIcon
  export const Cpu: LucideIcon
  export const Shield: LucideIcon
  export const Telescope: LucideIcon
  export const Hammer: LucideIcon
  export const Rocket: LucideIcon
  export const BarChart3: LucideIcon
  export const Star: LucideIcon
  export const Send: LucideIcon
  export const Loader2: LucideIcon
  export const CheckCircle2: LucideIcon
  export const Mail: LucideIcon
  export const MessageSquare: LucideIcon
  export const User: LucideIcon
  export const Github: LucideIcon
  export const Twitter: LucideIcon
  export const Linkedin: LucideIcon
  export const ChevronUp: LucideIcon
}

// R3F Three.js JSX elements
/// <reference types="@react-three/fiber" />

// Fix framer-motion v10 className typing issue
import type { HTMLMotionProps } from 'framer-motion'
declare module 'framer-motion' {
  interface AnimationProps {
    className?: string
  }
  export interface MotionProps extends AnimationProps {
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
  }
}
