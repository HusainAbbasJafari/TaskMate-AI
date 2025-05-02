import React, { useState } from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from 'react-redux';
import { taskDetails } from '../redux/features/taskSlice';
import { IoPersonAddSharp } from 'react-icons/io5';
import { MdDeleteForever } from "react-icons/md";
import useGetUsers from '../hooks/useGetUsers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask, updateTask } from '../api/taskApi';


const TaskCard = ({ id, title, description, priority, assignedTo, image ,opacity=1,handleClick}) => {
  console.log(id,"what id");
  const queryClient = useQueryClient();
   const { data: usersData ,isPending:usersPending, isError:usersIsError,error:usersError} = useGetUsers();
// Single Task by id
  

const assignedUsers = usersData?.filter(user => assignedTo?.includes(user._id)) || [];


  const taskDeleteMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      console.log("Deleting Task ID:", id); // Debugging
      await queryClient.cancelQueries(["tasks"]); // Cancel ongoing queries for tasks
      const previousTasks = queryClient.getQueryData(["tasks"]); // Get the current tasks from the cache
      queryClient.setQueryData(["tasks"], (oldTasks) =>
        oldTasks?.filter((task) => task._id !== id) // Optimistically remove the task
      );
      return { previousTasks }; // Return the previous state for rollback
    },
    onError: (err, variables, context) => {
      console.error("Error deleting task:", err); // Debugging
      queryClient.setQueryData(["tasks"], context.previousTasks); // Rollback to the previous state
    },
    onSettled: () => {
      console.log("Invalidating tasks query"); // Debugging
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refetch tasks after mutation
    },
  });




  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);


const updateTaskMutation = useMutation({
  mutationFn:updateTask,
  onSettled: () => {
    queryClient.invalidateQueries(['tasks']);
  },
})
  const handlePriorityChange = (e) => {

    console.log(e.target.value);
   
    const updates = { priority: e.target.value };
   
      updateTaskMutation.mutate({ id: id,updates});
  

    

  };
  const handleTaskDetails = (e) => {
    e.stopPropagation();
    console.log(taskData,"taskDeatal")
   
    dispatch(taskDetails(taskData));
     // dispatching task details to redux store
    // apicall to fetch task by id

    
   

  };

  const handleIconClick = (e) => {
    // e.stopImmediatePropagation(); // Prevent event bubbling
    e.stopPropagation(); // Prevent event propagation
    console.log("handleIconClick");
    setShowDropdown(!showDropdown); 
  };

  const handleCheckboxChange = (e) => {
    console.log(e, "handleCheckboxChange");
    const { value, checked } = e.target;
    console.log(value, checked, "udsfgysd");
    if (checked) {
      setSelectedUsers([...selectedUsers, value]);
    } else {
      setSelectedUsers(selectedUsers.filter((user) => user !== value));
    }
  };

    const handleAddProfiles = async () => {
    console.log("handleAddProfiles triggered");
    console.log("Selected Users:", selectedUsers);
  
    const updates = { assignedTo: selectedUsers };
    console.log("Updates to send:", updates);
  
    try {
      await updateTaskMutation.mutate({ id, updates });
      console.log("Profiles updated successfully");
    } catch (error) {
      console.error("Error updating profiles:", error);
    }
  
    setShowDropdown(false);
  };

  return (
    <div
      
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="card"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,cursor: 'grab',opacity:opacity
      }}

    >
      <div className="card-body"
    
        > 
        <div className="row g-2">
            
          <div className='col-7 d-flex flex-column gap-2'>

            
            <div className="d-flex gap-2 align-items-center ">
            <div  className="card-title m-0 px-2 rounded " >{title}</div>  <MdDeleteForever  className='text-danger  fs-5' onClick={()=>taskDeleteMutation.mutate(id)  } style={{cursor: 'pointer'}} />
            </div>
            
            <select
              onChange={handlePriorityChange}
              defaultValue={priority}
              className="form-select ps-0 py-0 select-fit  form-select-sm card-subtitle text-body-secondary shadow-none border-0"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <div className="">
             
               <div className="d-flex gap-2">
               <div className='fw-semibold  badge text-bg-info'>Asgn</div>
                <div className="position-relative d-flex align-items-center"  >
                <IoPersonAddSharp
                data-no-dnd="true" onClick={handleIconClick}
                  className="rounded-circle shadow fs-6 text-body-secondary"
                  style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                  
                />
                {showDropdown && (

                  <div className="dropdown-menu profile-dropdown glass show p-2" style={{ position: 'absolute', zIndex: 1 }}>
                      {
                        usersData?.map(user => (
                          <div key={user._id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={user._id}
                              id={user._id}
                              onChange={handleCheckboxChange}
                            />
                            
                            <label className="form-check-label" htmlFor={user._id}>
                              {user.username}
                            </label>
                          </div>
                        ))
                      }
                    {/* <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="User1"
                        id="User1"
                        onChange={handleCheckboxChange}
                      />
                      
                      <label className="form-check-label" htmlFor="User1">
                        User1
                      </label>

                    </div> */}


                    <button className="btn btn-primary btn-sm mt-2" onClick={handleAddProfiles}>
                      Add Profiles
                    </button>
                  </div>

                )}
              </div>

               </div>
               
              <ul className='list-unstyled  my-1 p-0'>

              
                {assignedUsers?.map(user =>   
                  <li key={user} className="text-body-secondary fs-6 lh-1 fw-semibold ">-{user.username}</li>
                )}
              </ul>
     
            </div>

            <p className="card-text card-description ">{description}</p>

          </div>

          <div className='col-5'>

         
                {/* Errrr Listeners */}
          {image && (
            <div className='d-flex justify-content-end p-0' style={{minWidth:"50%",minHeight:"100%",}}>  
            <img
              data-bs-toggle="modal" data-bs-target="#taskDetailModal"
              onClick={handleClick}
              src={image}
              alt="Task"
              className="img-thumbnail mt-2"
              style={{ maxHeight: '50px' }}
            />
            </div>
          )}

</div>

        </div>


      </div>


    </div>
  );
};

export default TaskCard;