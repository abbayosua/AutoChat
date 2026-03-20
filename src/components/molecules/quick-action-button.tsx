'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface QuickActionButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
  badge?: number
}

export function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  variant = 'ghost',
  className,
  badge,
}: QuickActionButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="icon"
            onClick={onClick}
            className={cn('relative', className)}
          >
            <Icon className="h-5 w-5" />
            {badge !== undefined && badge > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
