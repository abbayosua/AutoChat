'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { SidebarNav } from '@/components/organisms/sidebar-nav'
import { HeaderBar } from '@/components/organisms/header-bar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AvatarWithStatus } from '@/components/atoms/avatar-with-status'
import { TypingIndicator } from '@/components/atoms/TypingIndicator'
import { ConnectionStatus } from '@/components/atoms/ConnectionStatus'
import { cn } from '@/lib/utils'
import {
  Send,
  Plus,
  Hash,
  Users,
  MessageSquare,
  Loader2,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: { id: string; name: string; avatar?: string }
  timestamp: Date
}

interface Room {
  id: string
  name: string
  participantCount: number
  lastMessage?: string
  unread?: number
}

interface TypingUser {
  userId: string
  userName: string
}

export default function ChatPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  const [currentRoom, setCurrentRoom] = useState<string>('general')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [notificationCount, setNotificationCount] = useState(0)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // Current user info
  const currentUser = {
    id: 'agent-smith',
    name: 'Agent Smith',
    avatar: undefined,
  }

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  // WebSocket connection
  useEffect(() => {
    const newSocket = io('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    })

    socketRef.current = newSocket

    newSocket.on('connect', () => {
      setIsConnected(true)
      setIsLoading(false)
      newSocket.emit('get-rooms')
      newSocket.emit('join-room', 'general')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('rooms-list', (roomList: Room[]) => {
      setRooms(roomList)
    })

    newSocket.on('room-messages', (msgs: Message[]) => {
      setMessages(msgs.map(m => ({ ...m, timestamp: new Date(m.timestamp) })))
    })

    newSocket.on('new-message', (msg: Message) => {
      setMessages(prev => [...prev, { ...msg, timestamp: new Date(msg.timestamp) }])
    })

    newSocket.on('user-typing', (userId: string) => {
      setTypingUsers(prev => {
        if (prev.some(u => u.userId === userId)) return prev
        return [...prev, { userId, userName: userId }]
      })

      // Clear typing indicator after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers([])
      }, 3000)
    })

    return () => {
      newSocket.disconnect()
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch('/api/notifications?unread=true')
        const result = await response.json()
        if (result.success && result.data) {
          setNotificationCount(result.data.unreadCount || 0)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    }
    fetchNotificationCount()
  }, [])

  const joinRoom = (roomId: string) => {
    if (socketRef.current && roomId !== currentRoom) {
      socketRef.current.emit('leave-room', currentRoom)
      socketRef.current.emit('join-room', roomId)
      setCurrentRoom(roomId)
      setMessages([])
      setTypingUsers([])
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return

    socketRef.current.emit('send-message', {
      roomId: currentRoom,
      message: {
        content: newMessage,
        sender: currentUser,
      },
    })
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleTyping = () => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { roomId: currentRoom, userId: currentUser.id })
    }
  }

  // Filter rooms by search
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get current room info
  const currentRoomInfo = rooms.find(r => r.id === currentRoom)

  // Format time for messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <SidebarNav activeRoute="/chat" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderBar notificationCount={notificationCount} />

        {/* Chat Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Rooms List Sidebar */}
          <Card className="w-72 border-0 border-r rounded-none flex flex-col bg-white dark:bg-gray-900">
            {/* Rooms Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Chat Rooms
                </h2>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* Rooms List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
                  </div>
                ) : filteredRooms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No rooms found</p>
                  </div>
                ) : (
                  filteredRooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => joinRoom(room.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                        currentRoom === room.id
                          ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-lg',
                          currentRoom === room.id
                            ? 'bg-teal-100 dark:bg-teal-800'
                            : 'bg-gray-100 dark:bg-gray-800'
                        )}
                      >
                        <Hash className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{room.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {room.participantCount} participants
                        </p>
                      </div>
                      {room.unread && room.unread > 0 && (
                        <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-teal-500 text-white text-xs">
                          {room.unread}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Connection Status */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <ConnectionStatus isConnected={isConnected} showLabel />
            </div>
          </Card>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900">
                  <Hash className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {currentRoomInfo?.name || 'General Support'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {currentRoomInfo?.participantCount || 0} participants
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Be the first to send a message!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.sender.id === currentUser.id

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3 max-w-[80%]',
                          isOwn ? 'ml-auto flex-row-reverse' : ''
                        )}
                      >
                        {!isOwn && (
                          <AvatarWithStatus
                            name={message.sender.name}
                            src={message.sender.avatar}
                            status="online"
                            size="sm"
                          />
                        )}
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5',
                            isOwn
                              ? 'bg-teal-600 text-white rounded-tr-sm'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
                          )}
                        >
                          {!isOwn && (
                            <p className="text-xs font-medium text-teal-600 dark:text-teal-400 mb-1">
                              {message.sender.name}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p
                            className={cn(
                              'text-xs mt-1',
                              isOwn ? 'text-teal-100' : 'text-gray-500 dark:text-gray-400'
                            )}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })}

                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <AvatarWithStatus
                        name={typingUsers[0].userName}
                        status="online"
                        size="sm"
                      />
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                        <TypingIndicator text={`${typingUsers[0].userName} is typing`} />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Plus className="h-5 w-5" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    handleTyping()
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!isConnected || !newMessage.trim()}
                  className="bg-teal-600 hover:bg-teal-700 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
