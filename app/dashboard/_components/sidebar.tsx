'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { dashboardSidebar } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleRouteChange = () => {
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className='lg:hidden max-w-[100px] w-full flex justify-between items-center mb-4 gap-4 max-[355px]:w-[46px]'>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar Content */}
      <div 
        ref={sidebarRef}
        className={cn(
          'p-4 shadow-lg rounded-lg bg-background border',
          'transition-all duration-300 ease-in-out',
          'lg:block lg:static lg:w-[250px] lg:h-auto lg:translate-y-0 lg:opacity-100',
          'fixed top-20 left-0 z-50 w-[calc(100%-2rem)] max-w-xs h-[calc(100vh-70px)] overflow-y-auto',
          'max-lg:transition-transform max-lg:duration-300',
          isOpen 
            ? 'max-lg:opacity-100 max-lg:translate-x-0' 
            : 'max-lg:opacity-0 max-lg:-translate-x-full'
        )}
      >
        <h1 className='font-semibold text-lg mb-3 ml-3'>Dashboard</h1>
        <Separator className='my-2' />
        
        <nav className='space-y-1'>
          {dashboardSidebar.map(item => (
            <Button
              key={item.route}
              asChild
              variant={pathname === item.route ? 'secondary' : 'ghost'}
              className={cn(
                'gap-3 px-4 py-3 w-full justify-start',
                'transition-colors duration-200',
                pathname === item.route && 'font-semibold'
              )}
              onClick={() => setIsOpen(false)}
            >
              <Link href={item.route}>
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className='text-left whitespace-nowrap'>{item.name}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar