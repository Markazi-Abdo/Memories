import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axiosInstance';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Posts from '../components/Posts';
import { InfoIcon, LinkIcon, LockIcon, MailIcon, User2Icon } from 'lucide-react';

export default function Profile() {
  const client = useQueryClient();
  const { username } = useParams();
  const [ feedType, setFeedtype ] = useState("userposts");
  const [ update, setToUpdate ] = useState({
    username: "",
    email: "",
    password: "",
    confirmPass: "",
    bio: "",
    link: "",
    profilePic: "",
    coverPic: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setToUpdate({
        ...update,
        [name]: value
    })
  } 

  const handleFileInput = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if(!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
        setToUpdate({ ...update, [name]: fileReader.result})
    }
    fileReader.readAsDataURL(file);
  }

  const { data:user} = useQuery({ queryKey: [ "authUser" ] });
  const { data:profile, refetch } = useQuery({ 
    queryKey: [ "profileUser" ],
    queryFn: async () => {
        try {
            const fetchReq = await axiosInstance.get(`/user/profile/${username}`);
            return fetchReq.data;
        } catch (error) {
            toast.error("Coukdn't get user")
        }
    }
  });
  
  const isMyProfile = user?.data._id === profile?.profileData._id;

  useEffect(() => {
    refetch();
  }, [ refetch ])

  const { mutate:updateProfile } = useMutation({
    mutationFn: async () => {
        try {
            const updateAction = await axiosInstance.put("/user/update",  update );
            return updateAction.data;
        } catch (error) {
            toast.error("Something went wrong")
        }
    },
    onSuccess: () => {
        toast.success("Updated");
        client.invalidateQueries({ queryKey: [ "authUser" ]})
    }
  })

  return (
    <div>
        <div id='header' className='relative'>
            <div className='w-full h-56 bg-cover flex items-center justify-center border-b-2'>
                <img 
                src={ profile?.profileData?.coverPic ||"/vite.svg"}
                className='bg-cover'
                />
            </div>
            <div className='flex justify-between items-center gap-6 mx-2'>
                <div className='flex items-center gap-6'>
                    <img 
                    src={profile?.profileData?.profilePic || "/vite.svg"}
                    className='size-20 border rounded-full p-1'
                    />
                    <h2>
                        {profile?.profileData.username}
                    </h2>
                </div>
                {
                    isMyProfile && (
                        <div className='mr-6'>
                            <button className='btn btn-ghost rounded-full p-2 w-72'
                            onClick={()=>document.getElementById(`${profile?.profileData.username}_info`).showModal()}
                            >
                                Edit profile
                            </button>
                        </div>
                    )
                }
                
            </div>
        </div>
        <dialog className='modal' id={`${profile?.profileData.username}_info`} data-theme="synthwave">
            <div className='modal-box'>
                <h3 className='font-orbitron text-center'>-----Update your info-----</h3>
                <form className='grid grid-cols-2 divide-x-2 gap-2'>
                    <div className='col-span-1'>
                        <label htmlFor="username" className='input input-bordered input-sm flex items-center gap-2'>
                            <User2Icon />
                            <input 
                            name='username'
                            type='text'
                            value={update.username}
                            onChange={handleChange}
                            />
                        </label>
                        <label htmlFor="email" className='input input-bordered input-sm flex items-center gap-2'>
                            <MailIcon />
                            <input 
                            name='email'
                            type='email'
                            value={update.email}
                            onChange={handleChange}
                            />
                        </label>
                        <label htmlFor="password" className='input input-bordered input-sm flex items-center gap-2'>
                            <LockIcon />
                            <input 
                            name='password'
                            type='password'
                            value={update.password}
                            onChange={handleChange}
                            />
                        </label>
                        <label htmlFor="bio" className='input input-bordered input-sm flex items-center gap-2'>
                            <InfoIcon />
                            <input 
                            name='bio'
                            type='text'
                            value={update.bio}
                            onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className=''>ProfilePic
                        <label htmlFor="profilePic" className='flex items-center gap-2'> 
                            <InfoIcon />
                            <input 
                            name='profilePic'
                            type='file'
                            className='file-input file-input-bordered file-input-sm'
                            onChange={handleFileInput}
                            />
                        </label>CoverPic
                        <label htmlFor="coverPic" className='flex items-center gap-2'>
                            <InfoIcon />
                            <input 
                            name='coverPic'
                            type='file'
                            className='file-input file-input-bordered file-input-sm'
                            onChange={handleFileInput}
                            />
                        </label>
                        <label htmlFor="confirmPass" className='input input-bordered input-sm flex items-center gap-2'>
                            <LockIcon />
                            <input 
                            name='confirmPass'
                            type='password'
                            value={update.confirmPass}
                            onChange={handleChange}
                            />
                        </label>
                        <label htmlFor="link" className='input input-bordered input-sm flex items-center gap-2'>
                            <LinkIcon />
                            <input 
                            name='link'
                            type='text'
                            value={update.link}
                            />
                        </label>
                    </div>
                </form>
                <button 
                className='btn btn-square w-full rounded-full mt-4'
                onClick={updateProfile}
                >
                    Save Changes
                </button>
            </div>
        </dialog>
        <div className='flex flex-col justify-center'>
            <p>{profile?.profileData.bio}</p>
        </div>
        <div className='flex justify-center items-center w-full border-b-2 gap-2'>
            <div onClick={()=>setFeedtype("userposts")} className='cursor-pointer text-center border-r w-full'>
                <h2>Posts</h2>
            </div>
            <div onClick={()=>setFeedtype("likedposts")} className='cursor-pointer text-center w-full'>
                <h2>Liked Posts</h2>
            </div>
        </div>
        <div>
            <Posts feedType={feedType} username={profile?.profileData.username} id={profile?.profileData._id.toString()}/>
        </div>
    </div>
  )
}
