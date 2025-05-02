import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

const fetchTasks = async ({ queryKey }) => {
  const [, workspaceId] = queryKey; // Extract workspaceId from queryKey
  const response = await axiosInstance.get(`/tasks?workspaceId=${workspaceId}`); // Ensure workspaceId is sent
  return response.data;
};

const useTasks = (workspaceId) => {
  return useQuery({
    queryKey: ["tasks", workspaceId], // Use object form for queryKey
    queryFn: fetchTasks, // Use fetchTasks as the query function
    enabled: !!workspaceId, // Only fetch tasks if workspaceId is defined
  });
};

export default useTasks;