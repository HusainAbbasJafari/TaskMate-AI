import React, { useEffect, useState } from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiStar, CiShare2 } from "react-icons/ci";
import { GoScreenFull } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { IoPersonAddSharp } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";
import { GiSettingsKnobs } from "react-icons/gi";
import { IoAddOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { filterByUser, setWorkspace } from "../redux/features/taskSlice";
import usegetWorkspace from "../hooks/usegetWorkspace";
import useGetUsers from "../hooks/useGetUsers";
import { QueryClient, useMutation } from "@tanstack/react-query";
import {
  addUserToWorkspace,
  getAllWorkspacesForUser,
} from "../api/workspaceApi";
import useGetWorkpaceByAdmin from "../hooks/useGetWorkpaceByAdmin";
import SearchBar from "../utils/SearchBar";
import { useQueryClient } from "@tanstack/react-query"; // Import QueryClient
import useGetAllWorkspacesForUser from "../hooks/useGetAllWorkspacesForUser"; // Import the new hook
import { jwtDecode } from "jwt-decode"; // Import jwt-decode library
import SmartInput from "./SmartInput"; // Import the SmartInput component
const Homeheader = () => {
  const { selectedUser } = useSelector((state) => state.task);
  const { data: workspaces = [], refetch } = useGetAllWorkspacesForUser(); // Use the custom hook
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const handleUserChange = (e) => {
    const selectedValue = e.target.value;
    dispatch(filterByUser(selectedValue));
  };
  const {
    data: userData,
    isLoading: userLoading,
    isError: userIsError,
    error: userError,
  } = useGetUsers();

  // Decode the token from localStorage to get the logged-in user's ID
  const token = localStorage.getItem("token");
  const loggedInUserId = token ? jwtDecode(token)?._id : null; // Ensure the token contains the user ID

  const usersInWorkspace = userData?.filter((user) =>
    selectedWorkspace?.members?.some((memberId) => memberId === user._id)
  );

  const assignedUsers = userData?.filter((user) =>
    selectedWorkspace?.members?.includes(user._id)
  );

  useEffect(() => {
    if (workspaces.length > 0) {
      setSelectedWorkspace(workspaces[0]); // Default to the first workspace
      dispatch(setWorkspace(workspaces[0])); // Set the default workspace in Redux
    }
  }, [workspaces, dispatch]);

  const handleWorkspaceChange = (e) => {
    const workspaceId = e.target.value;
    const workspace = workspaces.find((ws) => ws._id === workspaceId);
    setSelectedWorkspace(workspace);
    dispatch(setWorkspace(workspace)); // Update the selected workspace in Redux
    queryClient.invalidateQueries(["tasks", workspaceId]); // Refetch task data for the selected workspace
  };

  // const handleAddUsers = async () => {
  //   if (!selectedWorkspace) {
  //     alert("Please select a workspace first.");
  //     return;
  //   }

  //   const userIds = ["userId1", "userId2"]; // Replace with actual user IDs to add
  //   console.log("Adding Users:", userIds); // Debugging

  //   try {
  //     const updatedWorkspace = await addUserToWorkspace({
  //       workspaceId: selectedWorkspace._id,
  //       userIds,
  //     });
  //     console.log("Updated Workspace:", updatedWorkspace); // Debugging
  //     setSelectedWorkspace(updatedWorkspace); // Update the selected workspace
  //     alert("Users added successfully!");

  //     // Refetch all workspaces after adding users
  //     refetch();
  //   } catch (err) {
  //     console.error("Failed to add users:", err);
  //     alert("Failed to add users. Please try again.");
  //   }
  // };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        
        <div className="text-secondary page-route">Projects / xyz</div>
        {workspaces.length > 0 ? (
          <select
            className="form-select form-select-sm "
            style={{ width: "200px" }}
            value={selectedWorkspace?._id || ""}
            onChange={handleWorkspaceChange}
          >
            {workspaces.map((workspace) => (
              <option key={workspace._id} value={workspace._id}>
                {workspace.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-danger">No workspaces available</p>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <h4>DP Board</h4>
        <div className="controls gap-2">
          <AiOutlineThunderbolt className="focus" />
          <CiStar className="focus" />
          <CiShare2 className="focus" />
          <GoScreenFull className="focus" />
          <BsThreeDots className="focus" />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="left d-flex align-items-center gap-2">
          <SearchBar />

          <div className="assignedProfiles d-flex  align-items-center">
            {usersInWorkspace?.map((user) => {
              return (
                <div key={user._id} className="position-relative userInfo">
                  <img
                    src="/Images/dummy.jpg"
                    className="profile userPic "
                    alt="assignedPro"
                  />
                  <div
                    style={{
                      backgroundColor: "rgb(197 196 209)",
                      fontSize: "small",
                    }}
                    className="position-absolute  userDetail  text-secondary rounded text-dark px-2 shadow"
                  >
                    {user.email}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dropdown">
            <Link
              className="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Epic
            </Link>
            <ul className="dropdown-menu">
              {/* Debugging: Log admin and user ID */}
              {console.log(
                "Selected Workspace Admins:",
                selectedWorkspace?.admin
              )}
              {console.log("Logged-in User ID:", loggedInUserId)}

              {/* Show "Add Users to Workspace" only if the logged-in user is an admin */}
              {selectedWorkspace?.admin?.includes(loggedInUserId) ? (
                <li>
                  <div
                    style={{ cursor: "pointer" }}
                    className="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#allUserModal"
                  >
                    Add Users to {selectedWorkspace?.name}
                  </div>
                </li>
              ) : (
                <li>
                  <div className="dropdown-item text-muted">
                    You are not authorized to add users to this workspace.
                  </div>
                </li>
              )}

              <li>
                <Link className="dropdown-item" to="/">
                  Another action
                </Link>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <Link className="dropdown-item" to="/">
                  Something else here
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="right d-flex gap-2">
          <div className="d-flex align-items-center gap-1 groupBy">
            <label
              htmlFor="groupBy"
              className="text-secondary   fw-lighter text-nowrap text-uppercase"
            >
              Group By
            </label>

            <select
              id="groupBy"
              className="shadow-none form-select form-select-sm"
              aria-label="Small select example"
              value={selectedUser}
              onChange={handleUserChange}
            >
              <option value="">All Users</option>
              {assignedUsers?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name || user.email} {/* Display user name or email */}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex">
            <div className="focus p-2 d-flex justify-content-center align-items-center  fs-6 ">
              <BsGraphUpArrow />
            </div>

            <div className="focus p-2 d-flex justify-content-center align-items-center  fs-6 ">
              <GiSettingsKnobs />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homeheader;
