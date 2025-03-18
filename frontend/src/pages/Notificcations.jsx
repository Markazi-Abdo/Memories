import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axiosInstance'
import { TrashIcon } from 'lucide-react';

export default function Notificcations() {
    const query = useQueryClient();
  const { data:authUser } = useQuery({ queryKey: ["authUser" ]});
  const { data:notifs } = useQuery({
    queryKey: ["notifs"],
    queryFn: async () => {
        try {
            const fetchReq = await axiosInstance.get("/notifs/getnotifs");
            return fetchReq.data;
        } catch (error) {
            toast.error("Something went wrong..")
        }
    }   
  })  

  const { mutate:deleteNotifs } = useMutation({
    mutationFn: async () => {
        try {
            const actionReq = await axiosInstance.delete("/notifs/deletenotifs");
            return actionReq.data
        } catch (error) {
            toast.error("Something went wrong")
        }
    }, 
    onSuccess: () => {
        toast.success("All deleted");
        query.invalidateQueries({ queryKey: [ "notifs" ]});
    }
  })
  return (
    <div className='mx-5 relative'>
        <div className='flex justify-between items-center border-b'>
            <h2>Notifications</h2>
            <h2 className='font-orbitron font-bold animate-pulse'>M</h2>
        </div>
        <div>
            {
                notifs?.notifications.length === 0 && (
                    <div>
                        <h1>No notifictions</h1>
                    </div>
                )
            }
            {/* {
                notifs?.from._id === notifs?.to && (
                    <div>
                        <h1>No notifictions</h1>
                    </div>
                )
            } */}
            {
                notifs?.notifications.map(n => {
                    return(
                        <div className='flex justify-between items-center border my-2 rounded-full p-2'>
                            <h2>{n?.from.username}</h2>
                            <h3>{n?.type}</h3>
                        </div>
                    )
                })
            }
        </div>
        <div className='absolute bottom-5 right-5'>
            <button 
            className='btn btn-circle '
            onClick={deleteNotifs}
            >
                <TrashIcon />
            </button>
        </div>
    </div>
  )
}
