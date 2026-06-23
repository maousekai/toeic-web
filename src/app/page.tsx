'use client'

import { RouterProvider, useRouter } from '@/lib/router'
import { AuthUIProvider } from '@/lib/auth/auth-ui-context'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { HomeView } from '@/components/home/home-view'
import { LearnView } from '@/components/learn/learn-view'
import { PracticeList } from '@/components/practice/practice-list'
import { TestEngine } from '@/components/practice/test-engine'
import { TestResults } from '@/components/practice/test-results'
import { TutorView } from '@/components/ai/tutor-view'
import { ToolsView } from '@/components/ai/tools-view'
import { DashboardView } from '@/components/dashboard/dashboard-view'

function CurrentView() {
  const { view } = useRouter()

  switch (view.name) {
    case 'home':
      return <HomeView />
    case 'learn':
    case 'grammar':
    case 'vocab':
    case 'strategies':
      return <LearnView />
    case 'practice':
      return <PracticeList />
    case 'test':
      return <TestEngine testSetId={view.testSetId} />
    case 'results':
      return <TestResults attemptId={view.attemptId} />
    case 'tutor':
      return <TutorView />
    case 'tools':
      return <ToolsView />
    case 'dashboard':
      return <DashboardView />
    default:
      return <HomeView />
  }
}

function Shell() {
  const { view } = useRouter()
  // Hide the global footer on the test-taking screen for focus
  const hideFooter = view.name === 'test' || view.name === 'tutor'

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <CurrentView />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default function Home() {
  return (
    <RouterProvider>
      <AuthUIProvider>
        <Shell />
      </AuthUIProvider>
    </RouterProvider>
  )
}
