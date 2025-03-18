import { useState } from "react";
import CreatePost from "../components/CreatePost";
import Posts from "../components/Posts";

export default function Home() {
  const [ feedType, setFeedType ] = useState("foryou");

  return (
    <div className='flex flex-col mr-auto border-r border-primary h-full'>
      {/* Header */}
      <div className='flex justify-center items-center w-full'>
          <div className='flex  w-full border-b border-base-100'>
              <div className="flex flex-1 justify-center items-center relative transition-colors  hover:bg-secondary/40 border-r-2 border-zinc-600"
              onClick={()=>setFeedType("foryou")}
              >
                <h2 className="text-center">For you</h2>
                {
                  feedType === "foryou" && <div className="absolute bottom-0 w-full h-1 border-b border-b-zinc-600"></div>
                }
              </div>
          </div>
          <div className='flex w-full border-b border-base-100'>
              <div className="flex flex-1 justify-center items-center relative transition-colors  hover:bg-secondary/40 "
               onClick={()=>setFeedType("following")}
              >
                <h2>Following</h2>
                {
                  feedType === "following" && <div className="absolute bottom-0 w-full h-1 border-b border-zinc-600"></div>
                }
              </div>
          </div>
      </div>
      <div className="mx-5">
        <CreatePost />
      </div>
      <div className="mx-5 mt-10">
        <Posts feedType={feedType}/>
      </div>
    </div>
  )
}
