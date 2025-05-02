import React, { useEffect, useState } from 'react';
import useGetUsers from '../hooks/useGetUsers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addUserToWorkspace } from '../api/workspaceApi';
import useGetWorkpaceByAdmin from '../hooks/useGetWorkpaceByAdmin';
import { setRegisteredUsers,getLoggedInUser } from '../redux/features/userSlice';
import { useDispatch } from 'react-redux';

const AllUserModel = () => {

const {data:adminWorkspace} = useGetWorkpaceByAdmin();
  const { data:users } = useGetUsers();
const dispatch = useDispatch();
const token =  localStorage.getItem('token');
console.log(token,"token in all user model inside function")
  useEffect(() => {
    if (users) {
      dispatch(setRegisteredUsers(users));
      dispatch(getLoggedInUser(token));
     
    }
  }, [users, dispatch,]);

  console.log(users,"userss")
  
  const [selectedUsers, setSelectedUsers] = useState([]);
//do not show add user o workspace opion if user is not admin
 
  const queryClient = useQueryClient();

  const addUserToWS = useMutation({
    mutationFn: addUserToWorkspace,
    onSuccess: async () => {
      console.log("Invalidating queries for adminWorkspace and users"); // Debugging
      await queryClient.invalidateQueries({ queryKey: ["workspaceAdmin"] }); // Invalidate admin workspace query
      await queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate users query
      await queryClient.invalidateQueries({ queryKey: ["allWorkspacesForUser"] }); // Invalidate all workspaces query if needed
    },
    onError: (error) => {
      console.error("Error adding users to workspace:", error); // Debugging
      alert("Failed to add users to workspace. Please try again.");

    }
  });

  // Handle checkbox change
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) 
        ? prev.filter((id) => id !== userId) // Remove if unchecked
        : [...prev, userId] // Add if checked
    );
  };
  

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const workspaceId = adminWorkspace._id;
    const userIds = selectedUsers;
    console.log(workspaceId,"admin id");
    console.log(userIds,"selected users");

    addUserToWS.mutate({ workspaceId, userIds }) ;
    // will make post call top add users with this users id and wporkspaceid
    e.target.reset();
    
    setSelectedUsers([]);
    // You can now send `selectedUsers` to the API or use it as needed
  };

  return (
    <div className="modal fade" id="allUserModal" tabIndex={-1} aria-labelledby="allUserModal" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">Select Users</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ maxHeight: "80vh", overflowY: "scroll" }} className="modal-body d-flex flex-column gap-2">
              {users?.map((user) => (
                <div key={user._id}>
                  <input
                    type="checkbox"
                    className="btn-check"
                    id={user._id}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleCheckboxChange(user._id)}
                  />
                  <label
                    className="btn btn-outline-primary w-100 d-flex justify-content-between align-items-center"
                    htmlFor={user._id}
                  >
                    <div>
                      <span className='text-dark fw-bold'>Name:</span> &nbsp; {user.username}
                    </div>
                    <div>
                      <span className='text-dark fw-bold'>Email:</span> &nbsp; {user.email}
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button type="submit" className="btn btn-success px-5" data-bs-dismiss="modal">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};

export default AllUserModel;
