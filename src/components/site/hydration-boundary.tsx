'use client'

import { Component, ReactNode } from 'react'

interface State {
  hasError: boolean
}

/**
 * HydrationBoundary — Bắt lỗi hydration mismatch và render lại.
 * Lỗi này thường do browser extension (Google Translate) dịch text.
 */
export class HydrationBoundary extends Component<{ children: ReactNode }, State> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // Force re-render sau 100ms để bỏ qua hydration mismatch
    setTimeout(() => {
      this.setState({ hasError: false })
    }, 100)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )
    }
    return this.props.children
  }
}
