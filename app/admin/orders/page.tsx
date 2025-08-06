import Filter from '@/components/shared/filter'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import OrderActions from '../_components/order-actions'
import { SearchParams } from '@/types'
import { FC } from 'react'
import { getOrders } from '@/actions/admin.action'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { formatPrice, sliceText } from '@/lib/utils'
import { format } from 'date-fns'

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
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full max-lg:hidden'>
        <h1 className='text-xl font-bold'>Orders</h1>
        <Filter />
      </div>

      <Separator className='my-3' />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          {orders && orders.length > 0 && <TableCaption>A list of your recent orders.</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='text-center'>
                  No orders found.
                </TableCell>
              </TableRow>
            )}
            {orders &&
              orders.map(order => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{sliceText(order.product.title, 20)}</TableCell>
                  <TableCell>{sliceText(order.user.email, 15)}</TableCell>
                  <TableCell>
                    <Badge variant={'secondary'}>{formatPrice(order.price)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'completed' ? 'default' : 'outline'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className='text-right'>
                    <OrderActions order={order} />
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
                <h3 className="font-medium line-clamp-1">{order.product.title}</h3>
                <p className="text-sm text-muted-foreground">{sliceText(order.user.email, 20)}</p>
              </div>
              <Badge variant={order.status === 'completed' ? 'default' : 'outline'}>
                {order.status}
              </Badge>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{formatPrice(order.price)}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(order.createdAt), 'dd MMM yyyy')}
                </p>
              </div>
              <OrderActions order={order} />
            </div>
          </div>
        ))}
      </div>

      <Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
    </div>
  )
}

export default Page