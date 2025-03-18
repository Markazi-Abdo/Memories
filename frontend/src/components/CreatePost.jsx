import { DeleteIcon, ImageIcon, SendIcon, XIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axiosInstance';

export default function CreatePost() {
  const queryClient = useQueryClient();
  const { data:authUser } = useQuery({ queryKey: [ "authUser" ] });
  const [ text, setText ] = useState("");
  const [ isTexting, setTexting ] = useState(false);
  const [ img, setImg ] = useState("");
  const inputRef = useRef(null);
  
  const inputClick = () => {
    inputRef.current.click();
  }

  const fileHandle = (e) => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader;
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
  
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
       try {
          const fetchReq = await axiosInstance.post("/posts/createpost", { text, image:img });
       } catch (error) {
         toast.error(error.message)
       }
    }, onSuccess: () => {
      setText("");
      setImg("");
      toast.success("Post Created", { duration: 1 });
      queryClient.invalidateQueries({ queryKey: [ "posts" ]});
    }, 
  })

  const removeText = () => {
    setText("");
    setTexting(false)
  }

  const removePreview = () => {
    setImg("");
  }


  return (
    <div className='p-2 border rounded-lg mt-5 mx-auto'>
      <h3>Create a post</h3>
      <div className='flex justify-between items-center my-4'>
          <div className='avatar w-10 flex gap-4'>
              <img src={authUser.data.profilePic || "/vite.svg"}/>
              <h4>{authUser.data.username}</h4>
          </div>
      </div>
      <div className='flex w-full gap-2 justify-between items-center mt-2'>
        <div className='w-full relative'>
          <input 
          type="text" 
          className='input input-bordered w-full rounded-full'
          placeholder='Something in your mind'
          value={text}
          onChange={(e) => {
              setText(e.target.value)
              setTexting(true);
          }}
          />
          {
            isTexting !== false && (
              <button className='absolute top-3 right-3'
              onClick={removeText}
              >
                <XIcon />
              </button>
            )
          }
        </div>
        <button className='btn btn-primary btn-ghost rounded-full tooltip' data-tip="Choose Image">
          <input 
          type="file" 
          className='hidden'
          ref={inputRef}
          accept='image/*'
          onChange={fileHandle}
          />
          <ImageIcon onClick={inputClick}/>
        </button>
        <button 
        className='btn btn-primary btn-ghost rounded-full tooltip' 
        data-tip="Post"
        onClick={mutate}
        >
          <SendIcon />
        </button>
      </div>
        {
          img !== ""  && (
          <div className='relative border border-secondary flex justify-center rounded-xl p-2 mt-2'>
              <img src={img} className='w-96'/>
              <button className='btn glass rounded-xl absolute top-0 right-0'
              onClick={removePreview}
              >
                <DeleteIcon />
              </button>
          </div>)
        }
    </div>
  )
}
