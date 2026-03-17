import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-[9px] text-xs font-bold cursor-pointer transition-opacity hover:opacity-90 active:opacity-75 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500',
  {
    variants: {
      variant: {
        primary:   'bg-btn text-white border-none',
        secondary: 'bg-white text-fg-muted border border-muted',
        ghost:     'bg-transparent border-none text-[#2e7d32]',
        outline:   'bg-[#f5f8f5] border border-[#e0ece0] text-[#546e7a]',
      },
      size: {
        default: 'px-3.5 py-1.5',
        icon: 'w-9 h-9 p-0',
        sm: 'px-2.5 py-1',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
