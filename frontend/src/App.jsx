import { Route as Nav, Navigate, Routes as Navs} from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import toast, { Toaster } from "react-hot-toast"
import SideBar from "./components/SideBar"
import SuugestedUsers from "./components/SuugestedUsers"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axiosInstance"
import { LoaderCircleIcon } from "lucide-react"
import Notificcations from "./pages/Notificcations"
import Profile from "./pages/Profile"

function App() {
  const { data:authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const fetchReq = await axiosInstance.get("/auth/authuser");
        return fetchReq.data;
      } catch (error) {
        toast.error(error.message);
      }
    }
  })
  {
    if(isLoading) return (
      <div className="flex justify-center items-center animate-pulse min-h-screen w-screen size-96 bg-base-100">
        <LoaderCircleIcon />
      </div>
    )
    
  }
  return (
    <main data-theme="black" className="min-h-screen w-screen bg-base-100">
      <div className="grid grid-cols-5">
        {authUser && <SideBar />}
        <div className={authUser ? "col-span-3" : "col-span-6"}>
          <Navs>
              <Nav path="/" exact element={authUser ? <Home /> : <Navigate to="/login" />}></Nav>
              <Nav path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />}></Nav>
              <Nav path="/login" element={!authUser ? <Login /> : <Navigate to="/" />}></Nav>
              <Nav path="/notifications" element={authUser ? <Notificcations /> : <Navigate to="/login" />}></Nav>
              <Nav path="/profile/:username" element={authUser ? <Profile/> : <Navigate to="/login" />}></Nav>
          </Navs>
        </div>
        {authUser && <SuugestedUsers />}
      </div>
      <Toaster 
      position="top-right"
      reverseOrder={ true }
      />
    </main>
  )
}

export default App
