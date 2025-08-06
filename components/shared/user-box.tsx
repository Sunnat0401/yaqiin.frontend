'use client'

import { IUser } from '@/types'
import { FC, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { signOut } from 'next-auth/react'
import { LogIn, User, Settings, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

interface Props {
  user: IUser
}

const UserBox: FC<Props> = ({ user }) => {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <Avatar className="h-10 w-10 cursor-pointer rounded-2xl transition-all duration-200 hover:scale-110">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="capitalize bg-primary text-white">
                {user.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 rounded-xl border bg-white dark:bg-gray-900 p-2 shadow-lg"
          align="end"
          onInteractOutside={() => setDropdownOpen(false)}
        >
          <DropdownMenuLabel className="flex items-center gap-2 p-2">
            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Mening hisobim
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
          
          {user.role === 'admin' && (
            <DropdownMenuItem 
              className="group cursor-pointer p-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Link 
                href="/admin" 
                className="flex w-full items-center gap-2"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100">
                  Admin
                </span>
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            className="group cursor-pointer p-2"
            onSelect={(e) => e.preventDefault()}
          >
            <Link 
              href="/dashboard" 
              className="flex w-full items-center gap-2"
              onClick={() => setDropdownOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100">
                Boshqaruv paneli
              </span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
          
          <DropdownMenuItem 
            className="group cursor-pointer p-2"
            onClick={() => {
              setOpen(true)
              setDropdownOpen(false)
            }}
          >
            <div className="flex w-full items-center gap-2">
              <LogIn className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100">
                Chiqish
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-xl border bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Haqiqatan ham ishonchingiz komilmi?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 dark:text-gray-300">
              Bu amalni bekor qilib bo'lmaydi. Bu sizni ilovadan chiqaradi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
            >
              Davom etish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default UserBox