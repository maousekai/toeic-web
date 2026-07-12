#!/bin/bash
# Detached server launcher — starts Next.js as an orphan process
cd /home/z/my-project

# Kill any existing
pkill -9 -f "next-server" 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
sleep 2

# Start socket.io service
cd /home/z/my-project/mini-services/realtime-service
bun run dev > /home/z/my-project/mini-services/realtime-service.log 2>&1 &
SOCKET_PID=$!

# Start Next.js — use exec to replace shell, then background
cd /home/z/my-project
NODE_OPTIONS="--max-old-space-size=3072" ./node_modules/.bin/next dev -p 3000 > /home/z/my-project/dev.log 2>&1 &
NEXT_PID=$!

# Write PIDs to file for tracking
echo "$NEXT_PID" > /tmp/next-pid
echo "$SOCKET_PID" > /tmp/socket-pid

# Exit immediately — children become orphans but should keep running
exit 0
