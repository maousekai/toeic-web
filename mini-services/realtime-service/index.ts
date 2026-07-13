import { createServer } from 'http'
import { Server } from 'socket.io'

const PORT = process.env.PORT || 3003
const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('OK')
})
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  path: '/socket.io/',
  maxHttpBufferSize: 1e7, // 10MB (cho phép gửi ảnh lớn)
})

// In-memory state (resets on restart — messages are also persisted via REST API)
const onlineUsers = new Set<string>() // userIds
const roomMembers = new Map<string, Set<string>>() // roomCode -> userIds (for video call)
const userSockets = new Map<string, Set<string>>() // userId -> socketIds

io.on('connection', (socket) => {
  console.log(`[+] ${socket.id} connected`)

  // ===== AUTH: client emits 'auth' with { userId, role, name } =====
  socket.on('auth', (payload: { userId: string; role: string; name: string }) => {
    if (!payload?.userId) return
    socket.data.userId = payload.userId
    socket.data.role = payload.role
    socket.data.name = payload.name
    onlineUsers.add(payload.userId)
    if (!userSockets.has(payload.userId)) userSockets.set(payload.userId, new Set())
    userSockets.get(payload.userId)!.add(socket.id)
    // Join personal room for direct messages
    socket.join(`user:${payload.userId}`)
    console.log(`[auth] ${payload.name} (${payload.role}) online`)
    io.emit('presence', { userId: payload.userId, online: true })
  })

  // ===== CHAT: join a chat room =====
  socket.on('chat:join', (roomId: string) => {
    if (!roomId) return
    socket.join(`chat:${roomId}`)
    console.log(`[chat] ${socket.data.name} joined room ${roomId}`)
  })

  // ===== CHAT: send message =====
  socket.on(
    'chat:message',
    (payload: { roomId: string; senderId: string; senderName: string; content: string; createdAt: string }) => {
      if (!payload?.roomId || !payload.content) return
      // Broadcast to everyone in the chat room
      io.to(`chat:${payload.roomId}`).emit('chat:message', payload)
      // Also ping the recipient's personal room (in case they're not in chat room yet)
      console.log(`[chat] ${payload.senderName}: ${payload.content.slice(0, 50)}`)
    },
  )

  // ===== CHAT: typing indicator =====
  socket.on('chat:typing', (payload: { roomId: string; userId: string; name: string }) => {
    socket.to(`chat:${payload.roomId}`).emit('chat:typing', payload)
  })

  // ===== VIDEO CALL (WebRTC signaling) =====
  // Teacher creates a class room
  socket.on('call:create', (payload: { roomCode: string; userId: string; name: string }) => {
    if (!payload?.roomCode) return
    socket.join(`call:${payload.roomCode}`)
    if (!roomMembers.has(payload.roomCode)) roomMembers.set(payload.roomCode, new Set())
    roomMembers.get(payload.roomCode)!.add(payload.userId)
    console.log(`[call] ${payload.name} created room ${payload.roomCode}`)
  })

  // Student joins a class room
  socket.on('call:join', (payload: { roomCode: string; userId: string; name: string }) => {
    if (!payload?.roomCode) return
    const members = roomMembers.get(payload.roomCode)
    if (!members || members.size === 0) {
      socket.emit('call:error', { message: 'Phòng học không tồn tại hoặc giáo viên chưa vào.' })
      return
    }
    socket.join(`call:${payload.roomCode}`)
    members.add(payload.userId)
    console.log(`[call] ${payload.name} joined room ${payload.roomCode}`)
    // Notify teacher that student joined
    socket.to(`call:${payload.roomCode}`).emit('call:student-joined', {
      userId: payload.userId,
      name: payload.name,
    })
  })

  // WebRTC offer (teacher → student)
  socket.on('call:offer', (payload: { roomCode: string; sdp: any; targetUserId?: string }) => {
    socket.to(`call:${payload.roomCode}`).emit('call:offer', {
      sdp: payload.sdp,
      fromUserId: socket.data.userId,
      fromName: socket.data.name,
    })
  })

  // WebRTC answer (student → teacher)
  socket.on('call:answer', (payload: { roomCode: string; sdp: any }) => {
    socket.to(`call:${payload.roomCode}`).emit('call:answer', {
      sdp: payload.sdp,
      fromUserId: socket.data.userId,
    })
  })

  // ICE candidates (both directions)
  socket.on('call:ice', (payload: { roomCode: string; candidate: any }) => {
    socket.to(`call:${payload.roomCode}`).emit('call:ice', {
      candidate: payload.candidate,
      fromUserId: socket.data.userId,
    })
  })

  // End call
  socket.on('call:end', (payload: { roomCode: string }) => {
    socket.to(`call:${payload.roomCode}`).emit('call:ended', { byUserId: socket.data.userId })
    socket.leave(`call:${payload.roomCode}`)
    const members = roomMembers.get(payload.roomCode)
    if (members) {
      members.delete(socket.data.userId)
      if (members.size === 0) roomMembers.delete(payload.roomCode)
    }
    console.log(`[call] ${socket.data.name} ended call in ${payload.roomCode}`)
  })

  // ===== Disconnect =====
  socket.on('disconnect', () => {
    const userId = socket.data.userId
    if (userId) {
      const socks = userSockets.get(userId)
      if (socks) {
        socks.delete(socket.id)
        if (socks.size === 0) {
          userSockets.delete(userId)
          onlineUsers.delete(userId)
          io.emit('presence', { userId, online: false })
        }
      }
    }
    console.log(`[-] ${socket.id} disconnected`)
  })
})

httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🔌 Realtime service running on http://0.0.0.0:${PORT}`)
  console.log(`   Socket.IO path: /socket.io/`)
})
