'use client'

import { FC } from 'react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  pageNumber: number
  isNext: boolean
}

const Pagination: FC<Props> = ({ isNext, pageNumber }) => {
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

  // Calculate page numbers to display (simplified for mobile)
  const getPageNumbers = () => {
    if (window.innerWidth <= 480) { // Mobile view
      if (pageNumber === 1 && !isNext) return []
      return [pageNumber] // Only show current page on small screens
    }

    // Desktop view
    const pages = []
    const maxVisiblePages = window.innerWidth <= 640 ? 3 : 5
    
    if (pageNumber > 2) {
      pages.push(1)
      if (pageNumber > 3) pages.push('...')
    }

    const start = Math.max(1, pageNumber - 1)
    const end = isNext ? Math.min(pageNumber + 1, pageNumber + 2) : pageNumber
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    if (isNext && end < pageNumber + 2) {
      if (pageNumber < end + 1) pages.push('...')
      pages.push(end + 1)
    }

    return pages
  }

  return (
    <div className='flex w-full items-center justify-center gap-1 mt-4 mb-4 px-2'>
      <Button 
        variant="outline"
        size="sm" 
        onClick={() => onNavigation('prev')} 
        disabled={pageNumber === 1}
        className='gap-1 min-w-[80px] sm:min-w-[100px]'
      >
        <ChevronLeft className='h-4 w-4' />
        <span className='hidden sm:inline'>Prev</span>
      </Button>

      <div className='flex items-center gap-1 mx-1'>
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-1 sm:px-2 py-1 text-sm">...</span>
          ) : (
            <Button
              key={index}
              variant={page === pageNumber ? "default" : "outline"}
              size="sm"
              onClick={() => onNavigation(Number(page))}
              className='min-w-[32px] sm:min-w-[40px] h-[32px] text-sm'
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
        className='gap-1 min-w-[80px] sm:min-w-[100px]'
      >
        <span className='hidden sm:inline'>Next</span>
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  )
}

export default Pagination