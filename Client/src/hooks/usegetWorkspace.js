    import React from 'react'
    import { getWorkspaces } from '../api/workspaceApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
    const usegetWorkspace = () => {

        const queryClient = useQueryClient();

        const {  data,error,isError,isLoading } = useQuery({
          queryKey:['workspace'],
          queryFn:getWorkspaces,
           
        })

      return {
       


data,error,isError,isLoading

      }
    }
    
    export default usegetWorkspace