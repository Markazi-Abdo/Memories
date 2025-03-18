export const formatTime = (time) => {
    return new Date(time).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    })
}