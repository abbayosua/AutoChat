// ============================================
// ATOMS: ConnectionStatus
// ============================================

import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  showLabel?: boolean;
  className?: string;
}

export function ConnectionStatus({ 
  isConnected, 
  showLabel = false, 
  className 
}: ConnectionStatusProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5',
        isConnected ? 'text-emerald-500' : 'text-rose-500',
        className
      )}
    >
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4" />
          {showLabel && <span className="text-xs font-medium">Connected</span>}
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          {showLabel && <span className="text-xs font-medium">Disconnected</span>}
        </>
      )}
    </div>
  );
}

export default ConnectionStatus;
