'use client'

import { IProduct } from '@/types'
import Image from 'next/image'
import { FC } from 'react'
import { Button } from '../ui/button'
import { Heart } from 'lucide-react'
import NoSSR from 'react-no-ssr'
import { cn, formatPrice } from '@/lib/utils'
import useAction from '@/hooks/use-action'
import { deleteFavorite } from '@/actions/user.action'
import { toast } from '@/hooks/use-toast'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

interface Props {
  product: Partial<IProduct>
  className?: string
}
const WatchListCard: FC<Props> = ({ product, className }) => {
  const { isLoading, onError, setIsLoading } = useAction()

  async function onDelete() {
    setIsLoading(true)
    const res = await deleteFavorite({ id: product._id! })
    if (res?.serverError || res?.validationErrors || !res?.data) {
      return onError('Something went wrong')
    }
    if (res.data.failure) {
      return onError(res.data.failure)
    }
    if (res.data.status === 200) {
      toast({ description: 'Product removed from watchlist' })
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all hover:shadow-md',
      'flex flex-col h-full',
      className
    )}>
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 z-50 flex items-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      )}
      
      <div className='relative aspect-square bg-secondary/50'>
        <Image 
          src={product.image!} 
          fill
          className='object-cover'
          alt={product.title!}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        <Button 
          size={'sm'}
          variant={'ghost'}
          className='absolute top-1 right-1 z-50 p-1 h-8 w-8 rounded-full bg-background/80 hover:bg-background'
          onClick={onDelete}
          disabled={isLoading}
          aria-label="Remove from watchlist"
        >
          <Heart className='h-4 w-4 text-red-500 fill-red-500' />
        </Button>
      </div>

      <div className='p-3 flex-1 flex flex-col'>
        <div className='flex justify-between items-center gap-2'>
          <h1 className='font-semibold text-sm line-clamp-2 flex-1'>
            {product.title}
          </h1>
          <NoSSR>
            <p className='font-medium text-sm whitespace-nowrap'>
              {formatPrice(+product.price!)}
            </p>
          </NoSSR>
        </div>
        <p className='text-xs text-muted-foreground mt-1 line-clamp-1'>
          {product.category}
        </p>
      </div>
    </Card>
  )
}

export default WatchListCard