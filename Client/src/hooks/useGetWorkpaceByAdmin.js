import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

const fetchWorkspaceByAdmin = async () => {
  const response = await axiosInstance.get("/workspace/admin-workspace");
  return response.data;
};

const useGetWorkpaceByAdmin = () => {
  return useQuery({
    queryKey: ["workspaceAdmin"], // Use object form for queryKey
    queryFn: fetchWorkspaceByAdmin, // Use fetchWorkspaceByAdmin as the query function
  });
};

export default useGetWorkpaceByAdmin;