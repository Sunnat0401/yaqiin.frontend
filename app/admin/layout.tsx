import { ChildProps } from '@/types'
import { FC } from 'react'
import Sidebar from './_components/sidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'

const Layout: FC<ChildProps> = async ({ children }) => {
  const session = await getServerSession(authOptions)

  if (!session) return redirect('/sign-in')
  if (session.currentUser?.role !== 'admin') return redirect('/')

  return (
    <div className='flex flex-col lg:flex-row gap-4 p-2 md:p-4'>
      {/* Sidebar - hidden below lg (1024px) except when hamburger menu is open */}
      <div className=' '>
        <Sidebar />
      </div>
      
      {/* Main content - full width below lg, adjusted when sidebar is visible */}
      <div className='flex-1 min-w-0 w-full lg:w-[calc(100%-20rem)] pb-10'>
        {children}
      </div>
    </div>
  )
}

export default Layout 