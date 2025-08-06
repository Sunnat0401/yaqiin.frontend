'use client'

import { deleteProduct } from '@/actions/admin.action'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useAction from '@/hooks/use-action'
import { useProduct } from '@/hooks/use-product'
import { toast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'
import { IProduct } from '@/types'
import Image from 'next/image'
import { FC } from 'react'
import NoSSR from 'react-no-ssr'

interface Props {
  product: IProduct
}
const ProductCard: FC<Props> = ({ product }) => {
  const { setOpen, setProduct } = useProduct()
  const { isLoading, onError, setIsLoading } = useAction()

  const onEdit = () => {
    setOpen(true)
    setProduct(product)
  }

  async function onDelete() {
    setIsLoading(true)
    const res = await deleteProduct({ id: product._id })
    if (res?.serverError || res?.validationErrors || !res?.data) {
      return onError('Something went wrong')
    }
    if (res.data.failure) {
      return onError(res.data.failure)
    }
    if (res.data.status === 200) {
      toast({ description: 'Product deleted successfully' })
      setIsLoading(false)
    }
  }

  return (
    <div className={`
      relative flex flex-col justify-between 
      border border-gray-200 dark:border-gray-700
      rounded-xl overflow-hidden
      bg-white dark:bg-gray-800
      shadow-md hover:shadow-lg transition-shadow duration-300
    `}>
      <div className='bg-gray-50 dark:bg-gray-700 relative p-4'>
        <Image 
          src={product.image!} 
          width={200} 
          height={200} 
          className='mx-auto object-contain h-48 w-full' 
          alt={product.title!} 
        />
        <Badge className='absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-500'>
          {product.category}
        </Badge>
      </div>

      <div className='p-4 flex-1 flex flex-col'>
        <div className='flex justify-between items-center mb-2'>
          <h1 className='font-bold text-lg text-gray-800 dark:text-white truncate'>
            {product.title}
          </h1>
          <NoSSR>
            <p className='font-medium text-blue-600 dark:text-blue-400'>
              {formatPrice(product.price!)}
            </p>
          </NoSSR>
        </div>
        <p className='text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1'>
          {product.description}
        </p>
        <Separator className='my-2 bg-gray-200 dark:bg-gray-600' />
      </div>

      <div className='grid grid-cols-2 gap-3 p-4'>
        <Button 
          variant={'outline'} 
          onClick={onEdit}
          className='border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700'
        >
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant={'outline'}
              className='border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700'
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-white dark:bg-gray-800'>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-gray-900 dark:text-white'>
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className='text-gray-600 dark:text-gray-300'>
                This action cannot be undone. This will permanently delete the product from your store.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDelete} 
                disabled={isLoading}
                className='bg-red-500 hover:bg-red-600'
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default ProductCard