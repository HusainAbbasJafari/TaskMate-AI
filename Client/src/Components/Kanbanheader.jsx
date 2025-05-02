import React from 'react'
import { IoAddOutline } from "react-icons/io5";

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { getWorkspaces,createWorkspace } from '../api/workspaceApi';
import usegetWorkspace from '../hooks/usegetWorkspace';
import useGetWorkpaceByAdmin from '../hooks/useGetWorkpaceByAdmin';

const Kanbanheader = () => {
   const {data,error,isError,isLoading}= useGetWorkpaceByAdmin()
   const {data:wsdata} = usegetWorkspace();
  //  console.log(wsdata,"wsdata")
  //  console.log(data,"datatattattat")
  const queryClient = useQueryClient();
  const workspaceAddMutate = useMutation({
      mutationFn:createWorkspace,
      onSuccess:async () => {
         await queryClient.invalidateQueries({ queryKey: ['workspace'] })
        await queryClient.invalidateQueries({ queryKey: ['workspaceAdmin'] })
      },
  })

  const handleSubmit = (e)=>{
    e.preventDefault();
    const name = e.target.workspaceName.value;
    workspaceAddMutate.mutate(name);
  }

  if(isLoading){
    return <h1>Loading...</h1>
  }



 
    
  return (
    <>
    {
      data===undefined?
      <div>
         <h1>No workspaces found</h1>
            <form onSubmit={handleSubmit}>
            <input type="text" id="workspaceName" name="workspaceName" placeholder="Enter workspace name"  required/>
            <label htmlFor="workspaceName"> Enter workspace name</label>

            <button type='submit'>Create Workspace</button>
            </form>
        </div>
:
    
         <div className="mt-3 row  border  py-1 ">
          <div className="col-6 col-lg-4">
            <div className="d-flex justify-content-between align-items-center text-secondary">
              <div className="focus w-100 shadow-none">Todo</div>

              <IoAddOutline
                className="focus"
                data-bs-toggle="modal"
                data-bs-target="#addform"
              />
            </div>
          </div>

          <div className="col-6 col-lg-4">
            <div className="d-flex justify-content-between align-items-center text-secondary">
              <div className="focus w-100 shadow-none">In-Progress</div>

              <IoAddOutline className="focus" />
            </div>
          </div>

          <div className="col-6 col-lg-4">
            <div className="d-flex justify-content-between align-items-center text-secondary">
              <div className="focus w-100 shadow-none">Completed</div>

              <IoAddOutline className="focus" />
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Kanbanheader