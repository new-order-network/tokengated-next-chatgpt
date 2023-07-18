import * as React from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { IconNextChat, IconSeparator } from '@/components/ui/icons'

import { ClearHistory } from '@/components/clear-history'
import Link from 'next/link'
import { Profile } from '@/components/profile'
import { Sidebar } from '@/components/sidebar'
import { SidebarFooter } from '@/components/sidebar-footer'
import { SidebarList } from '@/components/sidebar-list'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { auth } from '@/auth'
import { clearChats } from '@/app/actions'

export async function Header() {
  const user = await auth()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        {user ? (
          <></>
        ) : (
          // <Sidebar>
          //   <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          //     <SidebarList userId={user?.id} />
          //   </React.Suspense>
          //   <SidebarFooter>
          //     <ThemeToggle />
          //     <ClearHistory clearChats={clearChats} />
          //   </SidebarFooter>
          // </Sidebar>
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="w-6 h-6 mr-2 dark:hidden" inverted />
            <IconNextChat className="hidden w-6 h-6 mr-2 dark:block" />
          </Link>
        )}
        <div className="flex items-center">
          {/* <IconSeparator className="w-6 h-6 text-muted-foreground/50" /> */}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button variant="link" asChild className="-ml-2">
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
          <img
            className="ml-4"
            src="data:image/png;base64,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"
            alt="logo"
          ></img>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Profile />
      </div>
    </header>
  )
}
