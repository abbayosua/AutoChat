// ============================================
// ATOMS: AvatarWithStatus
// ============================================

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-400',
  away: 'bg-amber-500',
  busy: 'bg-rose-500',
};

interface AvatarWithStatusProps {
  src?: string;
  name: string;
  status?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const INDICATOR_SIZE = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

export function AvatarWithStatus({ 
  src, 
  name, 
  status = 'offline', 
  size = 'md',
  className 
}: AvatarWithStatusProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn('relative inline-flex', className)}>
      <Avatar className={SIZE_CLASSES[size]}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="text-xs font-medium bg-slate-200 text-slate-700">
          {initials}
        </AvatarFallback>
      </Avatar>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            STATUS_COLORS[status] || STATUS_COLORS.offline,
            INDICATOR_SIZE[size]
          )}
        />
      )}
    </div>
  );
}

export default AvatarWithStatus;
