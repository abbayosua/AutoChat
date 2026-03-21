// ============================================
// MOLECULES: AgentSelector
// ============================================

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AvatarWithStatus } from '@/components/atoms/AvatarWithStatus';
import type { Agent } from '@/types';

interface AgentSelectorProps {
  agents: Agent[];
  value?: string;
  onChange?: (agentId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AgentSelector({
  agents,
  value,
  onChange,
  placeholder = 'Assign agent',
  disabled = false,
  className,
}: AgentSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            <div className="flex items-center gap-2">
              <AvatarWithStatus
                name={agent.name}
                src={agent.avatar}
                status={agent.status}
                size="sm"
              />
              <div className="flex flex-col">
                <span className="font-medium">{agent.name}</span>
                <span className="text-xs text-slate-500">
                  {agent.status === 'online' ? '● Available' : '○ Away'}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default AgentSelector;
