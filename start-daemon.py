#!/usr/bin/env python3
"""Start Next.js as a detached daemon process."""
import subprocess
import os
import sys
import time

# Kill existing
subprocess.run(['pkill', '-9', '-f', 'next-server'], capture_output=True)
subprocess.run(['pkill', '-9', '-f', 'next dev'], capture_output=True)
time.sleep(2)

# Start socket.io service
subprocess.Popen(
    ['bun', 'run', 'dev'],
    cwd='/home/z/my-project/mini-services/realtime-service',
    stdout=open('/home/z/my-project/mini-services/realtime-service.log', 'w'),
    stderr=subprocess.STDOUT,
    stdin=subprocess.DEVNULL,
    start_new_session=True,  # detach from shell
)

time.sleep(3)

# Start Next.js
env = os.environ.copy()
env['NODE_OPTIONS'] = '--max-old-space-size=3072'
subprocess.Popen(
    ['./node_modules/.bin/next', 'dev', '-p', '3000'],
    cwd='/home/z/my-project',
    env=env,
    stdout=open('/home/z/my-project/dev.log', 'w'),
    stderr=subprocess.STDOUT,
    stdin=subprocess.DEVNULL,
    start_new_session=True,  # detach from shell
)

# Wait for server to be ready
import socket
for i in range(30):
    time.sleep(1)
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        s.connect(('127.0.0.1', 3000))
        s.close()
        print(f"✅ Next.js ready after {i+1}s")
        break
    except:
        pass
else:
    print("❌ Server failed to start")

# Also check socket.io
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    s.connect(('127.0.0.1', 3003))
    s.close()
    print("✅ Socket.io ready")
except:
    print("❌ Socket.io not ready")

print("Servers started as detached daemons. Exiting.")
