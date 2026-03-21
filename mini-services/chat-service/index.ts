import { Server } from 'socket.io'

const PORT = 3003

const io = new Server(PORT, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  ticketId?: string
}

interface ChatRoom {
  id: string
  name: string
  participants: string[]
  messages: Message[]
}

// In-memory storage for demo
const rooms: Map<string, ChatRoom> = new Map()

// Create default rooms
rooms.set('general', {
  id: 'general',
  name: 'General Support',
  participants: [],
  messages: []
})

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Join a chat room
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId)
    const room = rooms.get(roomId)
    if (room) {
      // Send existing messages
      socket.emit('room-messages', room.messages)
    }
  })

  // Leave a chat room
  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId)
  })

  // Send a message
  socket.on('send-message', (data: { roomId: string; message: Omit<Message, 'id' | 'timestamp'> }) => {
    const { roomId, message } = data
    const room = rooms.get(roomId)
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ...message,
      timestamp: new Date()
    }
    
    if (room) {
      room.messages.push(newMessage)
    }
    
    io.to(roomId).emit('new-message', newMessage)
  })

  // Get all rooms
  socket.on('get-rooms', () => {
    socket.emit('rooms-list', Array.from(rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      participantCount: r.participants.length
    })))
  })

  // Typing indicator
  socket.on('typing', (data: { roomId: string; userId: string }) => {
    socket.to(data.roomId).emit('user-typing', data.userId)
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

console.log(`Chat WebSocket server running on port ${PORT}`)
