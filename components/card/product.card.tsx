'use client'

import { IProduct } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, MouseEvent, useState } from 'react'
import { Button } from '../ui/button'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import NoSSR from 'react-no-ssr'
import useAction from '@/hooks/use-action'
import { addFavorite } from '@/actions/user.action'
import { toast } from '@/hooks/use-toast'
import { translateToUzbek } from '@/lib/constants'

interface Props {
	product: IProduct
}
const ProductCard: FC<Props> = ({ product }) => {
	const { isLoading, onError, setIsLoading } = useAction()
	const router = useRouter()
	const [isHovered, setIsHovered] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [isFavorited, setIsFavorited] = useState(false)

	const onFavourite = async (e: MouseEvent) => {
		e.stopPropagation()
		setIsLoading(true)
		const res = await addFavorite({ id: product._id })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Xatolik yuz berdi')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			setIsFavorited(true)
			toast({ description: '❤️ Sevimlilar ro\'yxatiga qo\'shildi!' })
			setIsLoading(false)
		}
	}

	const onQuickView = (e: MouseEvent) => {
		e.stopPropagation()
		router.push(`/product/${product._id}`)
	}

	return (
		<div 
			onClick={() => router.push(`/product/${product._id}`)} 
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className='group cursor-pointer animate-fade-in hover:scale-[1.02] transition-all duration-300 ease-out'
		>
			{/* Card Container */}
			<div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'>
				{/* Image Container */}
				<div className='relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden'>
					{/* Loading Skeleton */}
					{!imageLoaded && (
						<div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-shimmer bg-[length:400%_100%]' />
					)}
					
					{/* Product Image */}
					<Image 
						src={product.image!} 
						width={400} 
						height={400} 
						className={cn(
							'w-full h-full object-cover transition-all duration-500 ease-out',
							imageLoaded ? 'opacity-100' : 'opacity-0'
						)} 
						alt={product.title!}
						onLoad={() => setImageLoaded(true)}
						priority={false}
					/>

					{/* Overlay Actions */}
					<div className={cn(
						'absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-all duration-300',
						isHovered ? 'opacity-100' : 'opacity-0'
					)}>
						{/* Action Buttons */}
						<div className={cn(
							'absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 transform',
							isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
						)}>
							{/* Favorite Button */}
							<Button 
								size='sm'
								variant='secondary'
								disabled={isLoading} 
								onClick={onFavourite}
								className={cn(
									'w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110',
									isFavorited ? 'text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
								)}
							>
								<Heart className={cn('w-4 h-4 transition-all duration-200', isFavorited && 'fill-current')} />
							</Button>

							{/* Quick View Button */}
							<Button 
								size='sm'
								variant='secondary'
								onClick={onQuickView}
								className='w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 text-gray-600 dark:text-gray-300 hover:text-blue-500'
							>
								<Eye className='w-4 h-4' />
							</Button>
						</div>

						{/* Quick Add to Cart - Mobile/Desktop */}
						<div className={cn(
							'absolute bottom-3 left-3 right-3 transition-all duration-300 transform',
							isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
						)}>
						</div>
					</div>


				</div>

				{/* Product Info */}
				<div className='p-4 xs:p-3'>
					{/* Title and Price Row */}
					<div className='flex justify-between items-start gap-2 mb-2'>
						<h3 className='font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 text-sm xs:text-xs leading-tight flex-1'>
							{product.title}
						</h3>
						<div className='flex flex-col items-end shrink-0'>
							<NoSSR>
								<p className='font-bold text-blue-600 dark:text-blue-400 text-sm xs:text-xs whitespace-nowrap'>
									{formatPrice(product.price!)}
								</p>
							</NoSSR>
						</div>
					</div>

					{/* Category and Rating Row */}
					<div className='flex justify-between items-center'>
						<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize'>
							📂 {translateToUzbek(product.category)}
						</span>
						
						{/* Rating */}
						<div className='flex items-center gap-1'>
							<Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
							<span className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
								4.5
							</span>
						</div>
					</div>

					{/* Mobile Quick Actions */}
					<div className='xs:flex hidden items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700'>
						<Button 
							size='sm'
							variant='outline'
							disabled={isLoading} 
							onClick={onFavourite}
							className={cn(
								'flex-1 h-8 text-xs rounded-lg border-gray-200 dark:border-gray-600 transition-all duration-200',
								isFavorited ? 'text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20' : 'hover:text-red-500 hover:border-red-200'
							)}
						>
							<Heart className={cn('w-3 h-3 mr-1', isFavorited && 'fill-current')} />
							{isFavorited ? 'Yoqdi' : 'Yoqtirish'}
						</Button>
						<Button 
							size='sm'
							className='flex-1 h-8 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-all duration-200'
							onClick={(e) => {
								e.stopPropagation()
								toast({ description: '🛒 Savatchaga qo\'shildi!' })
							}}
						>
							<ShoppingCart className='w-3 h-3 mr-1' />
							Qo'shish
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductCard
