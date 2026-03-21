// ============================================
// ORGANISMS: TicketDetailModal
// ============================================

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge, PriorityBadge, SentimentBadge } from '@/components/atoms';
import { AvatarWithStatus } from '@/components/atoms/AvatarWithStatus';
import { MessageBubble, TagList, ActivityItem } from '@/components/molecules';
import { AgentSelector } from '@/components/molecules/AgentSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  X,
  Send,
  Sparkles,
  Clock,
  User,
  Tag as TagIcon,
  MessageSquare,
  Activity,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Ticket, User as UserType, Message, Activity as ActivityType, Tag } from '@/types';

interface TicketDetailModalProps {
  ticket: (Ticket & {
    customer?: UserType;
    agent?: UserType;
    messages?: Message[];
    activities?: ActivityType[];
    tags?: Tag[];
  }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (ticketId: string, status: string) => void;
  onAssign?: (ticketId: string, agentId: string) => void;
  onSendMessage?: (ticketId: string, message: string) => void;
  className?: string;
}

export function TicketDetailModal({
  ticket,
  open,
  onOpenChange,
  onStatusChange,
  onAssign,
  onSendMessage,
  className,
}: TicketDetailModalProps) {
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState('conversation');

  if (!ticket) return null;

  const handleSend = () => {
    if (replyText.trim()) {
      onSendMessage?.(ticket.id, replyText);
      setReplyText('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-4xl h-[85vh] p-0 flex flex-col', className)}>
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-slate-400 font-mono">
                  #{ticket.id.slice(0, 6)}
                </span>
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                {ticket.sentiment && (
                  <SentimentBadge sentiment={ticket.sentiment} score={ticket.sentimentScore} />
                )}
              </div>
              <DialogTitle className="text-xl">{ticket.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b px-4">
                <TabsList className="h-10">
                  <TabsTrigger value="conversation" className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Conversation
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="gap-1">
                    <Activity className="h-4 w-4" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="gap-1">
                    <FileText className="h-4 w-4" />
                    Notes
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="conversation" className="flex-1 flex flex-col m-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {ticket.messages?.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isOwn={msg.senderId === ticket.agentId}
                      />
                    ))}
                  </div>
                </ScrollArea>

                {/* Reply Input */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                      AI Suggest
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button onClick={handleSend} disabled={!replyText.trim()} className="self-end">
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="flex-1 m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-1">
                    {ticket.activities?.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                    {(!ticket.activities || ticket.activities.length === 0) && (
                      <p className="text-center text-slate-500 py-8">No activity yet</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="notes" className="flex-1 m-0">
                <div className="p-4 text-center text-slate-500">
                  Internal notes coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-72 border-l bg-slate-50 p-4 overflow-y-auto">
            {/* Customer Info */}
            {ticket.customer && (
              <div className="mb-6">
                <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Customer</h4>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <AvatarWithStatus
                    name={ticket.customer.name}
                    src={ticket.customer.avatar}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-sm">{ticket.customer.name}</p>
                    <p className="text-xs text-slate-500">{ticket.customer.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status & Priority */}
            <div className="mb-6 space-y-3">
              <div>
                <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Status</h4>
                <Select
                  value={ticket.status}
                  onValueChange={(value) => onStatusChange?.(ticket.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Priority</h4>
                <Select value={ticket.priority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-slate-500 uppercase mb-2 flex items-center gap-1">
                <TagIcon className="h-3 w-3" />
                Tags
              </h4>
              {ticket.tags && <TagList tags={ticket.tags} editable />}
            </div>

            {/* Timestamps */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-700">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Updated</span>
                <span className="text-slate-700">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TicketDetailModal;
