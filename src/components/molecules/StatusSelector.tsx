// ============================================
// MOLECULES: StatusSelector
// ============================================

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import type { TicketStatus } from '@/types';

interface StatusSelectorProps {
  value?: string;
  onChange?: (status: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const STATUS_OPTIONS: TicketStatus[] = [
  'open',
  'in_progress',
  'pending',
  'waiting_customer',
  'resolved',
  'closed',
];

export function StatusSelector({
  value,
  onChange,
  placeholder = 'Select status',
  disabled = false,
  className,
}: StatusSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((status) => (
          <SelectItem key={status} value={status}>
            <StatusBadge status={status} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default StatusSelector;
