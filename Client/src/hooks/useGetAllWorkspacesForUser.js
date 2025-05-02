import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesForUser } from "../api/workspaceApi";

const useGetAllWorkspacesForUser = () => {
  return useQuery({
    queryKey: ["allWorkspacesForUser"], // Query key for all workspaces
    queryFn: getAllWorkspacesForUser, // Fetch function
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};

export default useGetAllWorkspacesForUser;
