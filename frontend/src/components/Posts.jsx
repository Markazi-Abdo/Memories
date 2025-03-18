import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axiosInstance';
import toast from 'react-hot-toast';
import Post from './Post';
import { LoaderPinwheel } from 'lucide-react';

export default function Posts({ feedType, username, id }) {
  const getFeedType = () => {
    switch(feedType){
      case  "foryou":
        return "/posts/all";
      case "following":
        return "/posts/following";
      case "userposts":
        return `/posts/userposts/${username}`;
      case "likedposts":
        return `/posts/likedposts/${id}`;
      default:
        return "/posts/all";
    }
  }
  
  const FEED_ENDPOINT = getFeedType();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const action = await axiosInstance.get(`${FEED_ENDPOINT}`);
        toast.success("Got posts succesfully");
        return action.data;
      } catch (error) {
          toast.error(error.response.message)
      }
    },
  })

  useEffect(() => { 
    refetch()
  }, [ feedType, refetch, username, id ])

  if(isLoading){
    return (
      <div className='animate-spin'>
        <LoaderPinwheel />
      </div>
    )
  };

  if(isRefetching){
    return (
      <div className='animate-spin'>
        <LoaderPinwheel />
      </div>
    )
  };

  if(data?.quantity === 0 ){
    <div className='text-center'>
       <h2>NoBody Posted... :(</h2>
    </div>
  }

  return (
    <div>
      {
        data?.posts?.map(post => (
          <Post key={post._id} post={post}/>
        ))
      }
    </div>
  )
}
