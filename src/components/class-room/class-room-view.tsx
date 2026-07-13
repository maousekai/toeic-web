'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, Users, Loader2 } from 'lucide-react'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { useToast } from '@/hooks/use-toast'

export function ClassRoomView() {
  const { view, navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()
  const { toast } = useToast()
  const roomCode = view.name === 'class' ? view.roomCode : undefined

  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [remoteJoined, setRemoteJoined] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const isCallerRef = useRef<boolean>(false)

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  }

  // Join class via API
  useEffect(() => {
    if (!user) { setLoading(false); return }
    if (!roomCode) {
      // No room code — try to fetch active sessions
      fetch('/api/class/active')
        .then((r) => r.json())
        .then((d) => {
          if (d.sessions && d.sessions.length > 0) {
            setSession(d.sessions[0])
          }
          setLoading(false)
        })
      return
    }
    fetch('/api/class/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.session) setSession(d.session)
        else if (d.needVip) {
          toast({ title: 'Cần VIP', description: d.error, variant: 'destructive' })
          navigate({ name: 'vip' })
        } else {
          toast({ title: 'Lỗi', description: d.error, variant: 'destructive' })
        }
        setLoading(false)
      })
  }, [user, roomCode, navigate, toast])

  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    peerRef.current?.close()
    socketRef.current?.disconnect()
  }, [])

  // Setup media + WebRTC + socket
  useEffect(() => {
    if (!user || !session) return

    let cancelled = false

    const setup = async () => {
      // 1. Get user media
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return }
        localStreamRef.current = stream
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
      } catch (e: any) {
        toast({ title: 'Không truy cập được camera/mic', description: e.message, variant: 'destructive' })
      }

      // 2. Connect socket
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' && window.location.port === '3000'
        ? 'http://localhost:3003'
        : '/?XTransformPort=3003')
      const socket = io(socketUrl, { transports: ['websocket', 'polling'] })
      socketRef.current = socket
      socket.on('connect', () => {
        socket.emit('auth', { userId: user.id, role: user.role, name: user.name })
        
        // Teacher (or creator) is the caller
        if (user.id === session.teacherId) {
          isCallerRef.current = true
          socket.emit('call:create', { roomCode: session.roomCode, userId: user.id, name: user.name })
        } else {
          socket.emit('call:join', { roomCode: session.roomCode, userId: user.id, name: user.name })
        }
      })

      // 3. Create peer connection
      const peer = new RTCPeerConnection(ICE_SERVERS)
      peerRef.current = peer

      // Add local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => peer.addTrack(t, localStreamRef.current!))
      }

      // Remote track
      peer.ontrack = (e) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0]
          setRemoteJoined(true)
        }
      }

      // ICE candidates
      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit('call:ice', { roomCode: session.roomCode, candidate: e.candidate })
        }
      }

      // 4. Signaling handlers
      const pendingCandidates: RTCIceCandidateInit[] = []

      socket.on('call:student-joined', async () => {
        // Teacher creates offer when student joins
        if (isCallerRef.current) {
          const offer = await peer.createOffer()
          await peer.setLocalDescription(offer)
          socket.emit('call:offer', { roomCode: session.roomCode, sdp: offer })
        }
      })

      socket.on('call:offer', async (data: { sdp: any }) => {
        await peer.setRemoteDescription(data.sdp)
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        socket.emit('call:answer', { roomCode: session.roomCode, sdp: answer })
        
        pendingCandidates.forEach(c => peer.addIceCandidate(c).catch(() => {}))
        pendingCandidates.length = 0
      })

      socket.on('call:answer', async (data: { sdp: any }) => {
        await peer.setRemoteDescription(data.sdp)
        
        pendingCandidates.forEach(c => peer.addIceCandidate(c).catch(() => {}))
        pendingCandidates.length = 0
      })

      socket.on('call:ice', async (data: { candidate: any }) => {
        if (peer.remoteDescription && peer.remoteDescription.type) {
          try {
            await peer.addIceCandidate(data.candidate)
          } catch (e) {}
        } else {
          pendingCandidates.push(data.candidate)
        }
      })

      socket.on('call:ended', () => {
        toast({ title: 'Cuộc gọi đã kết thúc' })
        cleanup()
        navigate({ name: 'teachers' })
      })
    }

    setup()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [user, session, navigate, toast, cleanup])

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0]
    if (track) {
      track.enabled = !track.enabled
      setMicOn(track.enabled)
    }
  }

  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0]
    if (track) {
      track.enabled = !track.enabled
      setCamOn(track.enabled)
    }
  }

  const handleEndCall = () => {
    if (socketRef.current && session) {
      socketRef.current.emit('call:end', { roomCode: session.roomCode })
    }
    cleanup()
    navigate({ name: 'teachers' })
  }

  const copyRoomCode = () => {
    if (session?.roomCode) {
      navigator.clipboard.writeText(session.roomCode)
      toast({ title: 'Đã copy mã phòng', description: session.roomCode })
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p>Đăng nhập để tham gia lớp học</p>
        <Button className="mt-4" onClick={() => openAuth('login')}>Đăng nhập</Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Phòng học trực tuyến</h1>
          <p className="text-sm text-muted-foreground">Video call 1-1 với giáo viên</p>
        </div>
        <Button variant="outline" onClick={copyRoomCode} className="gap-2">
          <Copy className="h-4 w-4" />
          Mã phòng: <span className="font-mono font-bold">{session?.roomCode || '----'}</span>
        </Button>
      </div>

      {/* Video grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Remote video (teacher) */}
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-black">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            {!remoteJoined && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80">
                <Users className="h-12 w-12" />
                <p className="text-sm">
                  {user.id === session?.teacherId ? 'Đang chờ học viên tham gia...' : 'Đang chờ giáo viên tham gia...'}
                </p>
                <p className="text-xs text-white/60">Chia sẻ mã phòng: {session?.roomCode}</p>
              </div>
            )}
            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
              {user.id === session?.teacherId ? 'Học viên' : 'Giáo viên'}
            </div>
          </div>
        </Card>

        {/* Local video (you) */}
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-black">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
              Bạn
            </div>
            {!camOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white/80">
                <VideoOff className="h-12 w-12" />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button
          variant={micOn ? 'default' : 'destructive'}
          size="lg"
          className="h-14 w-14 rounded-full p-0"
          onClick={toggleMic}
          title={micOn ? 'Tắt mic' : 'Bật mic'}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button
          variant={camOn ? 'default' : 'destructive'}
          size="lg"
          className="h-14 w-14 rounded-full p-0"
          onClick={toggleCam}
          title={camOn ? 'Tắt camera' : 'Bật camera'}
        >
          {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="h-14 rounded-full px-6"
          onClick={handleEndCall}
        >
          <PhoneOff className="mr-2 h-5 w-5" /> Kết thúc
        </Button>
      </div>

      {/* Info card */}
      <Card className="mt-6 border-primary/20 bg-secondary/30">
        <CardContent className="p-4 text-sm">
          <p className="font-medium">💡 Hướng dẫn:</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• Gửi mã phòng <span className="font-mono font-bold">{session?.roomCode}</span> cho giáo viên/học viên kia để họ tham gia</li>
            <li>• Cho phép truy cập camera + mic khi trình duyệt hỏi</li>
            <li>• Cuộc gọi kết nối P2P (WebRTC) — dữ liệu không qua server trung gian</li>
            <li>• Nhấn "Kết thúc" để đóng phòng học</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
