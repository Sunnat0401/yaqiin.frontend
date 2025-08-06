import { getTransactions } from '@/actions/admin.action'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TransactionState } from '@/lib/constants'
import { cn, formatPrice, getStatusText, getStatusVariant } from '@/lib/utils'
import { SearchParams } from '@/types'
import { FC } from 'react'

interface Props {
  searchParams: SearchParams
}

const Page: FC<Props> = async props => {
  const searchParams = props.searchParams
  const res = await getTransactions({
    searchQuery: `${searchParams.q || ''}`,
    filter: `${searchParams.filter || ''}`,
    page: `${searchParams.page || '1'}`,
  })

  const transactions = res?.data?.transactions
  const isNext = res?.data?.isNext || false

  const totalAmount = transactions 
    ? transactions.filter(c => c.state === TransactionState.Paid).reduce((acc, curr) => acc + curr.amount, 0)
    : 0

  return (
    <div className="space-y-4">
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full max-lg:hidden'>
        <h1 className='text-xl font-bold'>Payments</h1>
        <Filter />
      </div>

      <Separator className='my-3' />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          {transactions && transactions.length > 0 && (
            <TableCaption>A list of your recent payments.</TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions && transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
            {transactions && transactions.map(transaction => (
              <TableRow key={transaction._id}>
                <TableCell className="font-medium">
                  {transaction.product.title}
                </TableCell>
                <TableCell>
                  <span className="truncate max-w-[180px] inline-block">
                    {transaction.user.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(transaction.state)}>
                    {getStatusText(transaction.state)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {transaction.provider}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <Badge
                    variant={'secondary'}
                    className={cn(
                      'text-base',
                      transaction.state === TransactionState.PaidCanceled && 'text-red-500 font-bold'
                    )}
                  >
                    {formatPrice(transaction.amount)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {transactions && transactions.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className='font-bold'>
                  Total
                </TableCell>
                <TableCell className='text-right'>
                  <Badge className="text-base">
                    {formatPrice(totalAmount)}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {transactions && transactions.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No transactions found.
          </div>
        )}

        {transactions && transactions.map(transaction => (
          <div 
            key={transaction._id}
            className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="space-y-1 flex-1">
                <h3 className="font-medium line-clamp-1">{transaction.product.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {transaction.user.email}
                </p>
              </div>
              <Badge variant={getStatusVariant(transaction.state)}>
                {getStatusText(transaction.state)}
              </Badge>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {transaction.provider}
                </Badge>
              </div>
              <Badge
                variant={'secondary'}
                className={cn(
                  'text-sm',
                  transaction.state === TransactionState.PaidCanceled && 'text-red-500 font-bold'
                )}
              >
                {formatPrice(transaction.amount)}
              </Badge>
            </div>
          </div>
        ))}

        {transactions && transactions.length > 0 && (
          <div className="p-4 border rounded-lg bg-card shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total</span>
              <Badge className="text-sm">
                {formatPrice(totalAmount)}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
    </div>
  )
}

export default Page