// 'use client'

// import { FC } from 'react'
// import { Button } from '../ui/button'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { formUrlQuery } from '@/lib/utils'

// interface Props {
// 	pageNumber: number
// 	isNext: boolean
// }
// const Pagination: FC<Props> = ({ isNext, pageNumber }) => {
// 	const router = useRouter()
// 	const searchParams = useSearchParams()

// 	const onNavigation = (direcation: 'prev' | 'next') => {
// 		const nextPageNumber = direcation === 'prev' ? pageNumber - 1 : pageNumber + 1

// 		const newUrl = formUrlQuery({
// 			key: 'page',
// 			params: searchParams.toString(),
// 			value: nextPageNumber.toString(),
// 		})
// 		router.push(newUrl)
// 	}

// 	if (!isNext && pageNumber === 1) return null

// 	return (
// 		<div className='flex w-full items-center justify-center gap-2 mt-4'>
// 			<Button size={'sm'} onClick={() => onNavigation('prev')} disabled={pageNumber === 1}>
// 				Prev
// 			</Button>
// 			<p>1</p>
// 			<Button size={'sm'} onClick={() => onNavigation('next')} disabled={!isNext}>
// 				Next
// 			</Button>
// 		</div>
// 	)
// }

// export default Pagination
'use client'

import { FC } from 'react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  pageNumber: number
  isNext: boolean
  totalPages?: number // Optional total pages for full pagination control
}

const Pagination: FC<Props> = ({ isNext, pageNumber, totalPages }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onNavigation = (direction: 'prev' | 'next' | number) => {
    let nextPageNumber = pageNumber
    
    if (direction === 'prev') {
      nextPageNumber = Math.max(1, pageNumber - 1)
    } else if (direction === 'next') {
      nextPageNumber = pageNumber + 1
    } else {
      nextPageNumber = direction
    }

    const newUrl = formUrlQuery({
      key: 'page',
      params: searchParams.toString(),
      value: nextPageNumber.toString(),
    })
    router.push(newUrl)
  }

  // Don't show pagination if there's only one page
  if (!isNext && pageNumber === 1) return null

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5 // Adjust this number as needed
    
    // Always show first page
    if (pageNumber > 2) {
      pages.push(1)
      if (pageNumber > 3) pages.push('...')
    }

    // Show current page and surrounding pages
    const start = Math.max(2, pageNumber - 1)
    const end = Math.min(totalPages || pageNumber + 2, pageNumber + 2)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Always show last page if needed
    if (pageNumber < (totalPages || pageNumber + 3) - 2) {
      if (pageNumber < (totalPages || pageNumber + 3) - 3) pages.push('...')
      if (totalPages) pages.push(totalPages)
      else if (isNext) pages.push(pageNumber + 3)
    }

    return pages
  }

  return (
    <div className='flex w-full items-center justify-center gap-2 mt-8'>
      <Button 
        variant="outline"
        size="sm" 
        onClick={() => onNavigation('prev')} 
        disabled={pageNumber === 1}
        className='gap-1'
      >
        <ChevronLeft className='h-4 w-4' />
        Prev
      </Button>

      <div className='flex items-center gap-1'>
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-2 py-1">...</span>
          ) : (
            <Button
              key={index}
              variant={page === pageNumber ? "default" : "outline"}
              size="sm"
              onClick={() => onNavigation(Number(page))}
              className='min-w-[40px]'
            >
              {page}
            </Button>
          )
        ))}
      </div>

      <Button 
        variant="outline"
        size="sm" 
        onClick={() => onNavigation('next')} 
        disabled={!isNext}
        className='gap-1'
      >
        Next
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  )
}

export default Pagination