#!/bin/bash
# Watchdog: keep Next.js running, restart if it dies
cd /home/z/my-project
pkill -9 -f "next-server" 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
sleep 2

while true; do
  echo "[$(date +%H:%M:%S)] Starting Next.js..."
  NODE_OPTIONS="--max-old-space-size=3072" ./node_modules/.bin/next dev -p 3000 > dev.log 2>&1
  PID=$!
  echo "[$(date +%H:%M:%S)] Next.js PID=$PID started"
  
  # Wait for it to die
  wait $PID 2>/dev/null
  EXIT_CODE=$?
  echo "[$(date +%H:%M:%S)] Next.js died (exit=$EXIT_CODE), restarting in 3s..."
  sleep 3
done
