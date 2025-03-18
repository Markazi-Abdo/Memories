import React from 'react'
import { BellIcon, Home, LogOut, LogOutIcon, NotebookIcon, User, User2Icon } from "lucide-react"
import { Link as Way } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axiosInstance';
import toast from 'react-hot-toast';

export default function SideBar() {
  const queryClient = useQueryClient();
  const { mutate:logOut } = useMutation({
    mutationFn: async () => {
      try {
        const fetchReq = await axiosInstance.post("/auth/logout");
        if(!fetchReq.data) return null;
      } catch (error) {
        toast.error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ "authUser" ]})
    }
  })

  const { data } = useQuery({ queryKey: [ "authUser" ]});
  console.log(data)
  return (
    <aside className='flex flex-col justify-between items-center p-6 border-r border-white h-screen sticky top-0 left-0'>
          <div className='flex flex-col justify-between items-center h-96'> 
              <div className='flex flex-col items-center gap-10'>
                <Way to="/">
                  <h2 className='text-8xl font-bold font-orbitron animate-pulse'>M</h2>
                </Way>
                <div className='flex'>
                  <Way to="/">
                    <Home size={32}/>
                  </Way>
                </div>
                <div className='flex'>
                  <Way to="/notifications">
                    <BellIcon /> 
                  </Way>
                </div>
                <div className='flex'>
                  <Way to={`/profile/${data.data.username}`}>
                    <User /> 
                  </Way>
                </div>
              </div>
              <div>
              </div>
            </div>
            <div className=' flex flex-col items-center gap-4'>
              <div className='flex flex-1 justify-center items-center'>
                <div className='avatar size-12'>
                  <img src={data.data.profilePic || "/vite.svg"} className='w-5 bg-primary size-5 rounded-full' alt="" /> 
                </div>
                <h5>{data.data.username}</h5>
              </div>
              <div>
                <button className='btn btn-active rounded-full w-full'
                onClick={logOut}
                >
                  <LogOut />
                </button>
              </div>
            </div>   
    </aside>
  )
}
