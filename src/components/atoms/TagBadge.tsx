// ============================================
// ATOMS: TagBadge
// ============================================

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  name: string;
  color?: string;
  removable?: boolean;
  onRemove?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function TagBadge({ 
  name, 
  color = '#6B7280', 
  removable = false, 
  onRemove,
  size = 'sm',
  className 
}: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-normal border',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1',
        className
      )}
      style={{ 
        borderColor: color,
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {name}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:opacity-70"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}

export default TagBadge;
