

import { useQuery } from '@tanstack/react-query';
import { getTaskDetails } from '../api/taskApi';

const useTask = (id) => {
 const {data,isLoading,isError,error}= useQuery({
  queryKey:['task'],
  queryFn: () => getTaskDetails(id) // Pass workspaceId to fetchTasks
   
})

  return { data, isLoading, isError, error };
};

export default useTask;