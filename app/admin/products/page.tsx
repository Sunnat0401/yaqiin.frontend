import Filter from '@/components/shared/filter'
import { Separator } from '@/components/ui/separator'
import AddProduct from '../_components/add-product'
import ProductCard from '../_components/product.card'
import { getProducts } from '@/actions/admin.action'
import { SearchParams } from '@/types'
import { FC } from 'react'
import Pagination from '@/components/shared/pagination'

interface Props {
  searchParams: SearchParams
}
const Page: FC<Props> = async props => {
  const searchParams = props.searchParams
  const res = await getProducts({
    searchQuery: `${searchParams.q || ''}`,
    filter: `${searchParams.filter || ''}`,
    category: `${searchParams.category || ''}`,
    page: `${searchParams.page || '1'}`,
  })

  const products = res?.data?.products
  const isNext = res?.data?.isNext || false

  return (
    <>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 w-full'>
        <div className='w-full flex items-center justify-between  '>
        <h1 className='text-xl font-bold'>Products</h1>
          <AddProduct/>
        </div>
      </div>
      <Separator className='my-3' />
          <div className='max-lg:hidden'>
		  <Filter showCategory/>
		  </div>


      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3'>
        {products && products.length === 0 && (
          <p className='text-muted-foreground col-span-full text-center'>No products found</p>
        )}
        {products && products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
    </>
  )
}

export default Page