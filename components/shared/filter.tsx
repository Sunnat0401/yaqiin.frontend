'use client'

import { Search, SlidersHorizontal, X, Filter as FilterIcon, Sparkles } from 'lucide-react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { categories, translateToEnglish, translateToUzbek } from '@/lib/constants'
import { cn, removeUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'
import { FC, useState, useEffect, useRef } from 'react'

interface Props {
  showCategory?: boolean
}

const Filter: FC<Props> = ({ showCategory }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Get current category from URL and translate to Uzbek for display
  const currentCategory = searchParams.get('category')
  const displayCategory = currentCategory ? translateToUzbek(currentCategory) : ''

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 750)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      // Modal ochilganda inputga fokus berish
      // Bu, modal ochilganda inputga avtomatik fokus berishni ta'minlaydi
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100); // Kichik kechikish modal animatsiyasi tugashini kutish uchun
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen]) // isModalOpen o'zgarganda ishga tushadi

  // Handle search with debounce
  const onSearchChange = debounce((value: string) => {
    const params = new URLSearchParams(searchParams)
    
    // Reset page to 1 when searching
    params.delete('page')
    
    if (value.trim()) {
      params.set('q', value.trim())
    } else {
      params.delete('q')
    }
    
    router.push(`/?${params.toString()}`, { scroll: false })
  }, 300)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    onSearchChange(value)
  }

  const clearSearch = () => {
    setSearchValue('')
    const params = new URLSearchParams(searchParams)
    params.delete('q')
    params.delete('page')
    router.push(`/?${params.toString()}`, { scroll: false })
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  // **YANGILANGAN EFFECT**: `searchValue` yoki `searchParams` o'zgarganda inputga fokusni qayta tiklash
  // Bu useEffect endi modal ichida ham ishlaydi, chunki shart o'zgartirildi
  useEffect(() => {
    // Agar input mavjud bo'lsa va u hozirda fokusda bo'lmasa, uni fokusga olib keling
    // Bu inputga yozishni davom ettirish imkonini beradi, hatto URL o'zgargan bo'lsa ham.
    if (inputRef.current && document.activeElement !== inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0); // Kichik kechikish DOM yangilanishidan keyin fokusni ta'minlaydi
    }
  }, [searchValue, searchParams]); // searchParams ham qo'shildi, chunki u router.push() chaqirilganda o'zgaradi

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    
    // Reset page to 1 when sorting
    params.delete('page')
    
    // Saralash qiymatlarini inglizchaga tarjima qilamiz
    let sortValue = value
    if (value === 'Eng yangilari') {
      sortValue = 'newest'
    } else if (value === 'Eng eskilari') {
      sortValue = 'oldest'
    }
    
    if (sortValue && sortValue !== 'newest') {
      params.set('filter', sortValue)
    } else {
      params.delete('filter')
    }
    
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const onCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    
    // Reset page to 1 when changing category
    params.delete('page')
    
    // Uzbekcha kategoriyani inglizchaga tarjima qilamiz URL uchun
    const englishCategory = translateToEnglish(value)
    
    if (englishCategory === 'All' || englishCategory === 'Barchasi') {
      params.delete('category')
    } else {
      params.set('category', englishCategory)
    }
    
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const FilterControls = () => (
    <>
      {/* Premium Search Input */}
      <div className='relative group flex-1 min-w-0'>
        <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none z-10'>
          <Search className='w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-all duration-300' />
        </div>
        <Input
          ref={inputRef}
          placeholder='Ajoyib mahsulotlarni kashf eting...'
          value={searchValue}
          className={cn(
            'pl-12 pr-12 h-[42px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
            'border-2 border-gray-200/50 dark:border-gray-700/50',
            'rounded-2xl text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:border-blue-500/70 dark:focus:border-blue-400/70',
            'focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20',
            'focus:bg-white dark:focus:bg-gray-900',
            'transition-all duration-300 ease-out',
            'shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20',
            'hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10',
            'focus:shadow-2xl focus:shadow-blue-500/20 dark:focus:shadow-blue-400/20',
            'text-gray-900 dark:text-gray-100 font-medium',
            'group-hover:border-gray-300/70 dark:group-hover:border-gray-600/70'
          )}
          onChange={handleSearchChange}
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className={cn(
              'absolute inset-y-0 right-4 flex items-center',
              'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              'transition-all duration-200 hover:scale-110'
            )}
          >
            <X className='w-5 h-5' />
          </button>
        )}
        {/* Premium glow effect */}
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none' />
      </div>

      {/* Premium Sort Filter */}
      <div className='relative group'>
        <Select onValueChange={onSortChange}>
          <SelectTrigger className={cn(
            'h-[42px] w-full min-w-[160px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
            'border-2 border-gray-200/50 dark:border-gray-700/50',
            'rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-medium',
            'hover:border-gray-300/70 dark:hover:border-gray-600/70',
            'focus:border-blue-500/70 dark:focus:border-blue-400/70',
            'focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20',
            'transition-all duration-300 ease-out',
            'shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20',
            'hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10',
            'focus:shadow-2xl focus:shadow-blue-500/20 dark:focus:shadow-blue-400/20'
          )}>
            <div className='flex items-center gap-3 px-2'>
              <div className='p-1.5 rounded-lg '>
                <SlidersHorizontal className='w-4 h-4 rounded-lg text-blue-400 dark:text-blue-100' />
              </div>
              <SelectValue placeholder='Saralash' className='text-gray-700 dark:text-gray-300' />
            </div>
          </SelectTrigger>
          <SelectContent className={cn(
            'rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50',
            'shadow-2xl shadow-gray-900/10 dark:shadow-gray-900/30',
            'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
            'p-2'
          )}>
            <SelectItem
              value='Eng yangilari'
              className={cn(
                'rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 font-medium',
                'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50',
                'dark:hover:from-blue-900/30 dark:hover:to-purple-900/30',
                'transition-all duration-200 cursor-pointer'
              )}
            >
              <div className='flex items-center gap-3'>
                <Sparkles className='w-4 h-4 text-blue-500' />
                Eng yangilari
              </div>
            </SelectItem>
            <SelectItem
              value='Eng eskilari'
              className={cn(
                'rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 font-medium',
                'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50',
                'dark:hover:from-blue-900/30 dark:hover:to-purple-900/30',
                'transition-all duration-200 cursor-pointer'
              )}
            >
              <div className='flex items-center gap-3'>
                <div className='w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600' />
                Eng eskilari
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Premium Category Filter */}
      {showCategory && (
        <div className='relative group'>
          <Select onValueChange={onCategoryChange} value={displayCategory}>
            <SelectTrigger className={cn(
              'h-[42px] w-full min-w-[180px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
              'border-2 border-gray-200/50 dark:border-gray-700/50',
              'rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-medium',
              'hover:border-gray-300/70 dark:hover:border-gray-600/70',
              'focus:border-blue-500/70 dark:focus:border-blue-400/70',
              'focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20',
              'transition-all duration-300 ease-out',
              'shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20',
              'hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10',
              'focus:shadow-2xl focus:shadow-blue-500/20 dark:focus:shadow-blue-400/20'
            )}>
              <div className='flex items-center gap-3 px-2'>
                <div className='p-1.5 rounded-lg '>
                  <div className='w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-500' />
                </div>
                <SelectValue placeholder='Barcha kategoriyalar' className='text-gray-700 dark:text-gray-300' />
              </div>
            </SelectTrigger>
            <SelectContent className={cn(
              'rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50',
              'shadow-2xl shadow-gray-900/10 dark:shadow-gray-900/30',
              'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
              'p-2 max-h-80 overflow-y-auto'
            )}>
              {categories.map(category => (
                <SelectItem
                  value={category}
                  key={category}
                  className={cn(
                    'rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 font-medium capitalize',
                    'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50',
                    'dark:hover:from-purple-900/30 dark:hover:to-pink-900/30',
                    'transition-all duration-200 cursor-pointer'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-4 h-4 rounded bg-gradient-to-br from-purple-400 to-pink-400' />
                    {category}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  )

  return (
    <div className="w-full">
      {/* Desktop Layout - Side by Side (750px+) */}
      <div className='hidden min-[750px]:block'>
        <div className={cn(
          'flex items-center gap-4 w-full p-6 rounded-3xl',
          'dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80',
        )}>
          <FilterControls />
        </div>
      </div>

      {/* Mobile Layout - Filter Button (Below 750px) */}
      <div className='min-[750px]:hidden flex'>
        <Button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            'w-[300px] h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 max-[500px]:w-full',
            'hover:from-blue-700 hover:via-purple-700 hover:to-pink-700',
            'text-white font-semibold text-base rounded-2xl',
            'shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40',
            'transition-all duration-300 ease-out',
            'hover:scale-[1.02] active:scale-[0.98]',
            'border-0 relative overflow-hidden',
            'ml-auto max-[500px]:mx-auto max-[500px]:justify-center justify-end',
          )}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000' />
          <div className='flex items-center gap-3 relative z-10'>
            <div className='p-2 rounded-xl bg-white/20 backdrop-blur-sm'>
              <FilterIcon className='w-5 h-5' />
            </div>
            <span>Filtrlarni ochish <span className='max-[380px]:hidden'>va qidirish</span></span>
            <Sparkles className='w-5 h-5 animate-pulse' />
          </div>
        </Button>
      </div>

      {/* Premium Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300'
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className={cn(
            'relative w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
            'rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50',
            'shadow-2xl shadow-gray-900/20 dark:shadow-gray-900/40',
            'animate-in zoom-in-95 slide-in-from-bottom-4 duration-300',
            'p-8'
          )}>
            {/* Modal Header */}
            <div className='flex items-center justify-between mb-8'>
              <div className='flex items-center gap-3'>
                <div className='p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 max-[400px]:hidden'>
                  <FilterIcon className='w-6 h-6 text-blue-600 dark:text-blue-400 ' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 max-[400px]:ml-2'>
                    Filtrlar va qidiruv
                  </h2>
                  <p className='text-sm text-gray-500 dark:text-gray-400 max-[400px]:ml-2'>
                    Aynan izlayotgan narsangizni toping
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-10 w-10 rounded-2xl text-gray-400 hover:text-gray-600',
                  'dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-all duration-200 hover:scale-110'
                )}
              >
                <X className='w-5 h-5' />
              </Button>
            </div>

            {/* Modal Filters */}
            <div className='space-y-6'>
              <FilterControls /> {/* Bu yerda FilterControls ishlatiladi */}
            </div>

            {/* Modal Footer */}
            <div className='flex gap-3 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50'>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className={cn(
                  'flex-1 h-12 rounded-2xl border-2 border-gray-200 dark:border-gray-700',
                  'hover:bg-gray-50 dark:hover:bg-gray-800',
                  'transition-all duration-200'
                )}
              >
                Bekor qilish
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className={cn(
                  'flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600',
                  'hover:from-blue-700 hover:to-purple-700',
                  'text-white font-semibold rounded-2xl',
                  'shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
                  'transition-all duration-200 hover:scale-[1.02]'
                )}
              >
                Filtrlarni qo'llash
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Filter