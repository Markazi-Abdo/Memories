import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstance";

export const useFollowToggle = () => {
    const queryClient = useQueryClient();
    const { mutate:follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const postReq = await axiosInstance.post(`/user/follow/${userId}`);
            } catch (error) {
                toast.error(error.message)
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: [ "suggestedUsers" ]}),
                queryClient.invalidateQueries({ queryKey: [ "authUser" ]})
            ])
            toast.success("User Followed")
        }
    })

    return { follow, isPending }
}