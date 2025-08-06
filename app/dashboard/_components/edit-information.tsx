'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit2, Loader } from 'lucide-react'
import FullNameForm from './full-name.form'
import EmailForm from './email.form'
import { IUser } from '@/types'
import { FC, useState } from 'react'
import { UploadDropzone } from '@/lib/uploadthing'
import useAction from '@/hooks/use-action'
import { updateUser } from '@/actions/user.action'
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

interface Props {
  user: IUser
}
const EditInformation: FC<Props> = ({ user }) => {
  const [open, setOpen] = useState(false)
  const { update } = useSession()
  const { isLoading, onError, setIsLoading } = useAction()

  const onUpdateAvatar = async (avatar: string, avatarKey: string) => {
    setIsLoading(true)
    const res = await updateUser({ avatar, avatarKey })
    if (res?.serverError || res?.validationErrors || !res?.data) {
      return onError('Something went wrong')
    }
    if (res.data.failure) {
      return onError(res.data.failure)
    }
    if (res.data.status === 200) {
      toast({ description: 'Avatar updated successfully' })
      update()
      setOpen(false)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Avatar Section */}
      <Card className="relative p-4 flex flex-col items-center">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 z-50 flex justify-center items-center rounded-lg">
            <Loader className="animate-spin h-8 w-8" />
          </div>
        )}
        
        <div className="relative group">
          <Avatar className="size-24 md:size-32 border-2 border-primary/20">
            <AvatarImage src={user.avatar} alt={user.fullName} />
            <AvatarFallback className="bg-primary text-white text-3xl md:text-5xl">
              {user.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="absolute -right-2 -bottom-2 rounded-full p-2"
                variant="default"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-center">Update Avatar</DialogTitle>
              </DialogHeader>
              <UploadDropzone
                endpoint="imageUploader"
                config={{ appendOnPaste: true, mode: 'auto' }}
                appearance={{ 
                  container: { 
                    height: 200, 
                    padding: '1rem',
                    border: '2px dashed #e2e8f0',
                    borderRadius: '0.5rem'
                  },
                  label: {
                    color: '#64748b'
                  }
                }}
                onClientUploadComplete={res => onUpdateAvatar(res[0].url, res[0].key)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Information Accordion */}
      <Card className="p-2 md:p-4 space-y-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="full-name">
            <AccordionTrigger className="hover:no-underline px-3 py-2 rounded-lg hover:bg-secondary/50">
              <div className="flex-1 text-left">
                <h2 className="font-semibold text-sm md:text-base">Full Name</h2>
                <p className="text-muted-foreground text-xs md:text-sm truncate">
                  {user.fullName}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-2 border-l-2 border-primary pl-4 ml-2">
              <FullNameForm user={user} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="email">
            <AccordionTrigger className="hover:no-underline px-3 py-2 rounded-lg hover:bg-secondary/50">
              <div className="flex-1 text-left">
                <h2 className="font-semibold text-sm md:text-base">Email</h2>
                <p className="text-muted-foreground text-xs md:text-sm truncate">
                  {user.email}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-2 border-l-2 border-primary pl-4 ml-2">
              <EmailForm user={user} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  )
}

export default EditInformation