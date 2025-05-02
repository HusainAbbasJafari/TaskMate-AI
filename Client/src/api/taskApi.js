import axiosInstance from './axiosInstance';

export const fetchTasks = async (workspaceId) => {
  const response = await axiosInstance.get(`/tasks/${workspaceId}`);
  return response.data;
};

export const getTaskDetails = async(id)=>{
  try{

    const response  =  await axiosInstance.get(`/tasks/${id}/details`);
    console.log(response.data,"responseTaskDetails")
    return response.data;

  }catch(err){
    console.log(err);
  } 
}

export const createTask = async (taskData) => {
  const response = await axiosInstance.post('/tasks', taskData);
  return response.data;
};

export const dragTask = async ({taskId, newStatus}) => {
  const response =await axiosInstance.put(`/tasks/${taskId}/drag`,{newStatus});
  return response.data;
}

export const updateTask = async ({ id, updates }) => {
  const response = await axiosInstance.put(`/tasks/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data;
};