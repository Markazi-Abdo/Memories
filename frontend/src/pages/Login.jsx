import { AtSign, EyeClosed, EyeClosedIcon, EyeIcon, Loader2Icon, LockIcon, MailCheckIcon, MailIcon, MailXIcon, User, User2Icon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axiosInstance';

export default function Signup() {
  const [ data, setData ] = useState({ email: "", password: "", confirmPass: "" })  
  const [ showPassword, setShowPassword ] = useState(true);
  const queryClient = useQueryClient();
  const togglePass = () => {
    setShowPassword(!showPassword);
  }
  const validateForm = () => {
    if( !data.email.trim() || !data.password.trim() || !data.confirmPass.trim() ) {
        toast.error("All fields should be filled in")
        return false;
    }
    if(data.password.length < 6){
        toast.error("Password should be longer than 6 characters");
        return false;
    }
    if(data.password !== data.confirmPass){
        toast.error("Passwords don't match, re-fill");
        return false;
    }
    if(!/\S+@\S+\.\S+/.test(data.email)){
        toast.error("Invalid e-mail format");
        return false;
    }

    return true;
  }

  const { mutate:loginFn, isPending, isSuccess, isError , error } = useMutation({
    mutationFn: async ({ email, password }) => {
        try {
            const action = await axiosInstance.post("/auth/login", { email, password });
            toast.success("Succesfully logged in");
        } catch (error) {
            toast.error(error.message);
        }
    }, onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [ "authUser" ]});
    }
  });

  const submitData = (e) => {
    e.preventDefault();
    if(validateForm()) {
        loginFn({ email: data.email, password: data.password });
    };
  }

  return (
    <div className="flex justify-center items-center flex-wrap gap-10 text-center">
        <div className='flex flex-col text-center'>
            <h1 className='font-orbitron text-[500px] font-bold animate-pulse'>M</h1>
        </div>
        <form className='text-left p-10 space-y-4 form-control w-2/6' onSubmit={submitData}>
            <h3 className='text-center text-6xl font-orbitron uppercase'>Welcome Back</h3>
            <label htmlFor="username" className='input input-bordered input-sm rounded-lg flex items-center gap-2'>
                <MailIcon />
                <input 
                type="text" 
                className='font-bold'
                placeholder='example@gmail.com'
                value={data.email}
                onChange={(e)=>setData({...data, email: e.target.value})}
                />
            </label>
            <label htmlFor="username" className='input input-bordered input-sm rounded-lg flex items-center justify-between gap-2'>
                <div className='flex justify-center items-center gap-2'>
                    <LockIcon />
                    {
                        showPassword ? (
                        <input 
                        type="password" 
                        className='font-bold'
                        placeholder='password' 
                        value={data.password}
                        onChange={(e)=>setData({...data, password: e.target.value})}
                        />
                        ) : (
                            <input 
                            type="text" 
                            className='font-bold'
                            placeholder='password'
                            value={data.password}
                            onChange={(e)=>setData({...data, password: e.target.value})}
                            />
                        )
                    }
                </div>
                <div className='flex items-center'  onClick={togglePass}>
                    <button type='button'>
                        {
                            showPassword ? <EyeIcon /> : <EyeClosedIcon />
                        }
                    </button>
                </div>
            </label>
            <label htmlFor="username" className='input input-bordered input-sm rounded-lg flex items-center justify-between gap-2'>
                <div className='flex justify-center items-center gap-2'>
                    <LockIcon />
                    {
                        showPassword ? (
                        <input 
                        type="password" 
                        className='font-bold'
                        placeholder='confrim your password' 
                        value={data.confirmPass}
                        onChange={(e)=>setData({...data, confirmPass: e.target.value})}
                        />
                        ) : (
                            <input 
                            type="text" 
                            className='font-bold'
                            placeholder='confrom your password'
                            value={data.confirmPass}
                            onChange={(e)=>setData({...data, confirmPass: e.target.value})}
                            />
                        )
                    }
                </div>
                <div className='flex items-center'  onClick={togglePass}>
                    <button type='button'>
                        {
                            showPassword ? <EyeIcon /> : <EyeClosedIcon />
                        }
                    </button>
                </div>
            </label>
            {
                isPending ? (
                    <button className='btn btn-primary w-full btn-circle'>
                        <Loader2Icon  className='animate-pulse'/>
                    </button>
                ) : (
                    <button className='btn btn-primary w-full btn-circle'>Log In</button>
                )
            }
            <div className='text-center'>
                <h4 className='mb-5'>Don't have an account ?</h4>
                <Link to="/signup">
                    <button className='btn btn-circle bg-base-300 text-white w-full'>
                        <h4 className='underline'>SignUp</h4>
                    </button>
                </Link>
            </div>
        </form>
    </div>
  )
}
