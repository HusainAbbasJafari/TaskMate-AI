import axiosInstance from "./axiosInstance";
// router.post('/create', ensureAuth, createWorkspace);
// router.post('/:id/add-users', ensureAuth, addUserToWorkspace);
// router.get('/my-workspaces', ensureAuth, getWorkspaces);
// router.get('/admin-workspace', ensureAuth, getWorkspaceByAdmin);
// router.get('/all-workspaces', ensureAuth, getAllWorkspacesForUser); // 
export const createWorkspace = async (name) => {
    const response = await axiosInstance.post("/workspace/create", {name});
    return response.data;
};

export const addUserToWorkspace = async ({ workspaceId, userIds }) => {
  try {
    console.log("API Request - Workspace ID:", workspaceId); // Debugging
    console.log("API Request - User IDs:", userIds); // Debugging

    const response = await axiosInstance.put(`/workspace/${workspaceId}/add-users`, { userIds }); // Ensure the endpoint matches the backend;
    console.log("API Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error adding users to workspace:", error.response?.data || error.message);
    throw error;
  }
};

export const getWorkspaces = async () => {
    const response = await axiosInstance.get("/workspace/my-workspaces");
    return response.data;
};

export const getWorkspaceByAdmin = async () => {
    const response = await axiosInstance.get("/workspace/admin-workspace");
    return response.data;
};

export const getAllWorkspacesForUser = async () => {
  try {
    const response = await axiosInstance.get("/workspace/all-workspaces");
    console.log("API Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching workspaces:", error.response?.data || error.message);
    // localStorage.removeItem('token');
    throw error;
  }
};