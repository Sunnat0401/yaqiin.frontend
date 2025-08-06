import { getOrders } from '@/actions/user.action'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice } from '@/lib/utils'
import { SearchParams } from '@/types'
import { format } from 'date-fns'
import React, { FC } from 'react'

interface Props {
  searchParams: SearchParams
}

const Page: FC<Props> = async props => {
  const searchParams = props.searchParams
  const res = await getOrders({
    searchQuery: `${searchParams.q || ''}`,
    filter: `${searchParams.filter || ''}`,
    page: `${searchParams.page || '1'}`,
  })

  const orders = res?.data?.orders
  const isNext = res?.data?.isNext || false

  return (
    <div className="space-y-4">
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full'>
        <h1 className='text-xl font-bold max-lg:hidden'>Orders</h1>
        <Filter showCategory />
      </div>

      <Separator className='my-3' />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          {orders && orders.length > 0 && <TableCaption>A list of your recent orders.</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Order time</TableHead>
              <TableHead className='text-right'>Updated time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  No orders found.
                </TableCell>
              </TableRow>
            )}
            {orders && orders.map(order => (
              <TableRow key={order._id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {order.product.title}
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === 'completed' ? 'default' : 'outline'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatPrice(order.price)}
                </TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), 'dd-MMM yyyy')}
                </TableCell>
                <TableCell className='text-right'>
                  {format(new Date(order.updatedAt), 'dd-MMM hh:mm a')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {orders && orders.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No orders found.
          </div>
        )}
        
        {orders && orders.map(order => (
          <div 
            key={order._id}
            className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1 flex-1">
                <h3 className="font-medium line-clamp-2">{order.product.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={order.status === 'completed' ? 'default' : 'outline'}>
                    {order.status}
                  </Badge>
                  <span className="text-sm font-medium">{formatPrice(order.price)}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Ordered</p>
                <p>{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated</p>
                <p>{format(new Date(order.updatedAt), 'dd MMM hh:mm a')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
    </div>
  )
}

export default Page