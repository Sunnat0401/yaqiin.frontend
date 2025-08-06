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

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5 // Ko'rsatiladigan maksimal sahifalar soni
    
    // Agar joriy sahifa 4 dan katta bo'lsa, 1-sahifani ko'rsatamiz
    if (pageNumber > 3) {
      pages.push(1)
      // Agar joriy sahifa 4 dan farq qilsa, "..." ko'rsatamiz
      if (pageNumber > 4) pages.push('...')
    }

    // Atrofidagi sahifalarni hisoblaymiz
    const start = Math.max(1, pageNumber - 1)
    const end = isNext ? pageNumber + 1 : pageNumber // Agar next disabled bo'lsa, keyingi sahifani ko'rsatmaymiz
    
    for (let i = start; i <= end; i++) {
      // Bitta sahifa 2 marta qo'shilmasligi uchun
      if (!pages.includes(i)) pages.push(i)
    }

    // Agar "Next" tugmasi active bo'lsa, keyingi sahifalarni ko'rsatamiz
    if (isNext) {
      if (pageNumber < end + 2) pages.push('...')
      pages.push(end + 2) // Oxirgi sahifani ko'rsatish
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