// ============================================
// MOLECULES: TagList
// ============================================

import { TagBadge } from '@/components/atoms/TagBadge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tag } from '@/types';

interface TagListProps {
  tags: Tag[];
  maxVisible?: number;
  editable?: boolean;
  onAddTag?: () => void;
  onRemoveTag?: (tagId: string) => void;
  className?: string;
}

export function TagList({
  tags,
  maxVisible = 3,
  editable = false,
  onAddTag,
  onRemoveTag,
  className,
}: TagListProps) {
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  return (
    <div className={cn('flex items-center gap-1 flex-wrap', className)}>
      {visibleTags.map((tag) => (
        <TagBadge
          key={tag.id}
          name={tag.name}
          color={tag.color}
          removable={editable}
          onRemove={() => onRemoveTag?.(tag.id)}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          +{remainingCount} more
        </span>
      )}
      {editable && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-slate-500"
          onClick={onAddTag}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add tag
        </Button>
      )}
    </div>
  );
}

export default TagList;
