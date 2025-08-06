import { getTransactions } from '@/actions/user.action'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TransactionState } from '@/lib/constants'
import { cn, formatPrice, getStatusText, getStatusVariant } from '@/lib/utils'
import { SearchParams } from '@/types'
import Image from 'next/image'
import React, { FC } from 'react'

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

  return (
    <div className="space-y-4">
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full'>
        <h1 className='text-xl font-bold max-lg:hidden'>Payments</h1>
        <Filter />
      </div>

      <Separator className='my-3' />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          {transactions && transactions.length > 0 && <TableCaption>A list of your recent transactions.</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
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
                <TableCell>
                  <Image 
                    src={transaction.product.image} 
                    alt={transaction.product.title} 
                    width={50} 
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.product.title}
                </TableCell>
                <TableCell>
                  <Badge className='capitalize' variant={'outline'}>
                    {transaction.provider}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(transaction.state)}>
                    {getStatusText(transaction.state)}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <Badge
                    variant={'secondary'}
                    className={cn(
                      'text-sm',
                      transaction.state === TransactionState.PaidCanceled && 'text-red-500 font-bold'
                    )}
                  >
                    {formatPrice(transaction.amount)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
            className="p-3 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Image 
                  src={transaction.product.image} 
                  alt={transaction.product.title} 
                  width={60} 
                  height={60}
                  className="rounded-md object-cover w-[60px] h-[60px]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{transaction.product.title}</h3>
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  <Badge className='capitalize text-xs' variant={'outline'}>
                    {transaction.provider}
                  </Badge>
                  <Badge variant={getStatusVariant(transaction.state)} className="text-xs">
                    {getStatusText(transaction.state)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
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
      </div>

      <Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
    </div>
  )
}

export default Page