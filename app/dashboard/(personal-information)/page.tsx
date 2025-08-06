import { Separator } from '@/components/ui/separator'
import { Banknote, Heart, Shuffle } from 'lucide-react'
import EditInformation from '../_components/edit-information'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getStatistics } from '@/actions/user.action'
import { Card } from '@/components/ui/card'

const Page = async () => {
  const session = await getServerSession(authOptions)
  const res = await getStatistics()

  const statistics = res?.data?.statistics

  return (
    <div className="space-y-4 px-2 max-[355px]:p-0 m-0 space-y-0">
      <div>
        <h1 className='text-lg sm:text-xl font-semibold'>Personal information</h1>
        <Separator className='my-2 sm:my-3' />
        <EditInformation user={JSON.parse(JSON.stringify(session?.currentUser))} />
      </div>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3'>
        <Card className='p-3 sm:p-4 flex flex-col items-center transition-all hover:shadow-md active:scale-[0.98]'>
          <div className='p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-2 sm:mb-3'>
            <Shuffle size={32} className='text-blue-600 dark:text-blue-400' />
          </div>
          <div className='text-center'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
              {statistics?.totalOrders || 0}
            </h1>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>Orders</p>
          </div>
        </Card>

        <Card className='p-3 sm:p-4 flex flex-col items-center transition-all hover:shadow-md active:scale-[0.98]'>
          <div className='p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-full mb-2 sm:mb-3'>
            <Banknote size={32} className='text-green-600 dark:text-green-400' />
          </div>
          <div className='text-center'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
              {statistics?.totalTransactions || 0}
            </h1>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>Payments</p>
          </div>
        </Card>

        <Card className='p-3 sm:p-4 flex flex-col items-center transition-all hover:shadow-md active:scale-[0.98]'>
          <div className='p-2 sm:p-3 bg-rose-50 dark:bg-rose-900/20 rounded-full mb-2 sm:mb-3'>
            <Heart size={32} className='text-rose-600 dark:text-rose-400' />
          </div>
          <div className='text-center'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
              {statistics?.totalFavourites || 0}
            </h1>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>Watch list</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Page