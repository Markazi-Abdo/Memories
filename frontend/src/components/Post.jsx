import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckSquareIcon, MessageSquareText, PlusIcon, PlusSquareIcon, SendIcon, ThumbsUp, Trash2Icon } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstance";
import { useFollowToggle } from "../hooks/followHook";

export default function Post({ post }) { 
  const queryClient = useQueryClient();
  const [ comment, setComment ] = useState("");
  const [ liked, setLiked ] = useState(false);
  const [ followed, setFollowed ] = useState(false);
  const { data:user } = useQuery({ queryKey: [ "authUser" ]});
  const { follow } = useFollowToggle();
  
  const followToggle = () => {
    follow(post.user._id);
    setFollowed(!followed);
  }
  const { mutate:deletePost } = useMutation({
    mutationFn: async () => {
        try {
            const action = await axiosInstance.delete(`/posts/deletepost/${post._id.toString()}`);
            return action.data;
        } catch (error) {
            toast.error(error.message)
        }
    },
    onSuccess: () => {
        toast.success("Post deleted");
        queryClient.invalidateQueries({ queryKey: [ "posts" ]});
    },
  })

  const { mutate:likePost, isPending:isLiking } = useMutation({
    mutationFn: async () => {
        try {
            const postReq = await axiosInstance.post(`/posts/like/${post._id.toString()}`);
            console.log(postReq)
            return postReq.data.data;
        } catch (error) {
            toast.error("Problem occured, try again")
        }
    },
    onSuccess: (updated) => {
        toast.success("Liked Post");
        queryClient.setQueryData(["posts"], (oldData) => {
            return oldData.map(p => {
                if(p._id === post._id){
                    return {
                        ...p,
                        likes: updated
                    }
                }
                return p;
            })
        })
    }
  })

  const { mutate:commentOnPost } = useMutation({
    mutationFn: async () => {
        try {
            const postReq = await axiosInstance.post(`/posts/comment/${post._id}`, { text:comment });
            return postReq.data;
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
  })
  return (
    <div className="flex flex-col border-2 rounded-xl mx-auto p-2">
        <div id="header" className="flex justify-between items-center p-2">
            <div className="flex justify-between items-center gap-2">
                <div className="avatar w-8 border border-slate-900 p-1 rounded-full">
                    <img src={post.user.profilePic || "/vite.svg"} alt="" />
                </div>
                <h4>{post.user.username}</h4>
            </div>
            <div>
                <button 
                className="btn btn-ghost rounded-full"
                onClick={followToggle}
                >
                    {
                        !followed ? (
                            <PlusSquareIcon />
                        ) : (
                            <CheckSquareIcon />
                        )
                    }
                 
                </button>
            </div>
        </div>
        <div id="body" className="border-2 rounded-xl p-2">
            <p className="underline">{post.text}</p>
        </div>
        {
            post.image && (
                <div>
                    <img src={post.image} alt="" />
                </div>
            )
        }
        <div id="footer" className="flex justify-between items-center mx-2 mt-2">
            <div className="flex justify-between items-center gap-5 mt-2">
                <button 
                className="transition-colors hover:bg-error/90 rounded-full p-2 flex items-center justify-between gap-1.5"
                onClick={likePost}
                >
                    <ThumbsUp />
                    <span>{post.likes.length}</span>
                </button>
                <button 
                className="transition-colors hover:bg-neutral/90 rounded-full p-2 flex items-center justify-between gap-1.5"
                onClick={()=>document.getElementById(`${post._id}_modal`).showModal()}
                >
                    <MessageSquareText />
                    <span>{post.comments.length}</span>
                </button>
            </div>
            <dialog id={`${post._id}_modal`} className="modal">
                <div className="modal-box">
                    <h5>What you think about this post</h5>
                    <label className="flex items-center input input-bordered input-sm rounded-3xl">
                        <MessageSquareText />
                        <input 
                        type="text" 
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                        className=" w-full"
                        />
                    </label>
                    <button 
                    className="btn btn-sm btn-circle w-full mt-2"
                    onClick={commentOnPost}
                    >
                        <SendIcon />
                    </button>
                        {
                            post.comments.map(c => {
                                return(
                                    <div className="border border-white rounded-3xl p-2 my-5 flex flex-col justify-between ">
                                        <div className="flex items-center gap-2">
                                            <div className="avatar w-5">
                                                <img src={post.user.profilePic || "/vite.svg"} alt="" />
                                            </div>
                                            <h4>{post.user.username}</h4>
                                        </div>
                                        <h5>{c.text}</h5>
                                    </div>
                                )
                            })
                        }
                </div>
            </dialog>
            {
                post.user._id === user.data._id && (
                    <button 
                    className="transition-colors hover:bg-neutral/90 rounded-full p-2"
                    onClick={deletePost}
                    >
                        <Trash2Icon />
                    </button>
                )
            }
        </div>
    </div>
  )
}
