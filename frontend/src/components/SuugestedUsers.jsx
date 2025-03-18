import { useQuery } from '@tanstack/react-query'
import React from 'react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axiosInstance'
import { PlusSquareIcon } from 'lucide-react'
import { useFollowToggle } from '../hooks/followHook'

export default function SuugestedUsers() {
  const { data:suggestedUsers , isLoading } = useQuery({
    queryKey: [ "suggestedUsers" ],
    queryFn: async () => {
      try {
        const fetchReq = await axiosInstance.get("/user/suggestions");
        return fetchReq.data;
      } catch (error) {
        toast.error(error.response.error.message)
      }
    }
  })

  const { follow, isPending } = useFollowToggle();

  return (
    <aside className='h-screen border-l flex flex-col gap-12 items-center max-lg:hidden w-full border-white p-12'>
        <h2 className='text-2xl'>Suggested Users</h2>
        <div className='border border-white rounded-xl p-2 divide-y-2'>
           {
            suggestedUsers?.data.map(user => (
              <div className='flex justify-between items-center gap-1 my-2'>
                <div className='flex items-center justify-between gap-4'>
                    <div className='avatar w-14'>
                        <img src={user.profilePic || "/vite.svg"} />
                    </div>
                    <div>
                      <h4 className='text-end'>{user.username}</h4>
                    </div>
                </div>
                <div>
                  <button 
                  className='tooltip' data-tip="follow"
                  onClick={()=>follow(user._id)}
                  >
                    <PlusSquareIcon />
                  </button>
                </div>
              </div>
            ))
           } 
        </div>
    </aside>
  )
}
