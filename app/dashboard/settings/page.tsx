'use client'

import { updatePassword, updateUser } from '@/actions/user.action'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import useAction from '@/hooks/use-action'
import { toast } from '@/hooks/use-toast'
import { passwordSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signOut } from 'next-auth/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Page = () => {
  const { isLoading, onError, setIsLoading } = useAction()

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { confirmPassword: '', newPassword: '', oldPassword: '' },
  })

  async function onDelete() {
    setIsLoading(true)
    const res = await updateUser({ isDeleted: true, deletedAt: new Date() })
    if (res?.serverError || res?.validationErrors || !res?.data) {
      return onError('Something went wrong')
    }
    if (res.data.failure) {
      return onError(res.data.failure)
    }
    if (res.data.status === 200) {
      toast({ description: 'Account deleted successfully' })
      setIsLoading(false)
      signOut({ callbackUrl: '/sign-up' })
    }
  }

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true)
    const res = await updatePassword(values)
    if (res?.serverError || res?.validationErrors || !res?.data) {
      return onError('Something went wrong')
    }
    if (res.data.failure) {
      return onError(res.data.failure)
    }
    if (res.data.status === 200) {
      toast({ description: 'Password updated successfully' })
      setIsLoading(false)
      form.reset()
    }
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <h1 className='text-xl font-bold'>Danger zone</h1>
      <Separator className='my-3' />
      
      {/* Delete Account Card */}
      <Card className='p-4 space-y-3'>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold'>Delete account</h2>
          <p className='text-sm text-muted-foreground'>
            Deleting your account will remove all your data from our servers. This action is irreversible.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className='w-full sm:w-fit' 
              size={'sm'} 
              variant={'destructive'}
              disabled={isLoading}
            >
              Delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[95vw] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDelete} 
                disabled={isLoading}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isLoading ? 'Deleting...' : 'Continue'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>

      {/* Change Password Card */}
      <Card className='p-4'>
        <h2 className='text-lg font-semibold mb-3'>Change Password</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='Enter current password' 
                      type='password' 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='Enter new password' 
                      type='password' 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='Confirm new password' 
                      type='password' 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <Button 
              type='submit' 
              className='w-full sm:w-auto'
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default Page