import { createSlice, createSelector } from "@reduxjs/toolkit";

const loadState = () =>{
  return {
    todo: [],
    inProgress: [],
    completed: [],
    taskDetails: null,
    offCanvasToggle: true,
    selectedUser: "", // Add selectedUser to initial state
    searchQuery: "",  // Add searchQuery to initial state
    selectedWorkspace: null, // Add selectedWorkspace to the state
  };
}
 


// const saveState = (state) => {
//   const { todo, inProgress, completed, taskDetails, offCanvasToggle } = state;
//   const stateToSave = { todo, inProgress, completed, taskDetails, offCanvasToggle };
//   localStorage.setItem("tasks", JSON.stringify(stateToSave));
// };

const taskSlice = createSlice({
  name: "task",
  initialState: loadState(),
  reducers: {
    // addTask: (state, action) => {
    //   state.todo.push({ ...action.payload, id: Date.now() });
    //   saveState(state);
    // },
    // delTask:(state, action) => {  
    //   const  id  = action.payload;
    //   for (const key of ["todo", "inProgress", "completed"]) {
    //     const index = state[key].findIndex((task) => task.id === id);
    //     if (index !== -1) {
    //       state[key].splice(index, 1);
    //       saveState(state);
    //       break;
    //     }
    //   }
    // },
    // moveTask: (state, action) => {
    //   const { taskId, newStatus } = action.payload;
    //   let task;

    //   for (const key of ["todo", "inProgress", "completed"]) {
    //     const index = state[key].findIndex((task) => task.id === taskId);
    //     if (index !== -1) {
    //       task = state[key].splice(index, 1)[0];
    //       break;
    //     }
    //   }

    //   if (task) {
    //     state[newStatus].push(task);
    //     saveState(state);
    //   }
    // },
    // updatePriority: (state, action) => {
    //   const { id, priority } = action.payload;
    //   let task;

    //   for (const key of ["todo", "inProgress", "completed"]) {
    //     task = state[key].find((task) => task.id === id);
    //     if (task) {
    //       task.priority = priority;
    //       saveState(state);
    //       break;
    //     }
    //   }
    // },
    // addProfiles: (state, action) => {
    //   const { id, profiles } = action.payload;
    //   let task;

    //   for (const key of ["todo", "inProgress", "completed"]) {
    //     task = state[key].find((task) => task.id === id);
    //     if (task) {
    //       const uniqueProfiles = [...new Set([...task.assignedTo, ...profiles])];
    //       task.assignedTo = uniqueProfiles;
    //       saveState(state);
    //       break;
    //     }
    //   }
    // },
    taskDetails: (state, action) => {
      state.taskDetails = action.payload;
    //   const id = action.payload;
    //   let task;

    //   for (const key of ["todo", "inProgress", "completed"]) {
    //     task = state[key].find((task) => task.id === id);
    //     if (task) {
    //       state.taskDetails = task;
    //       saveState(state);
    //       break;
    //     }
    // }
  },

    toggleOffCanvas: (state, action) => {
      state.offCanvasToggle = !state.offCanvasToggle;
    },
    
    filterByUser: (state, action) => {
      state.selectedUser = action.payload;
      // if(state.selectedUser === ""){
      //   state.todo = loadState().todo;
      //   state.inProgress = loadState().inProgress;
      //   state.completed = loadState().completed;
      // }else{
      //   filterTasks(state);
      // }
     
    },

    filterBySearch: (state, action) => {
      state.searchQuery = action.payload;
      // if(state.searchQuery === ""){
      //   state.todo = loadState().todo;
      //   state.inProgress = loadState().inProgress;
      //   state.completed = loadState().completed;
      // }else{
      //   filterTasks(state);
      // }
      
    },

    setWorkspace: (state, action) => {
      state.selectedWorkspace = action.payload;
    },
  },
});

// const filterTasks = (state) => {
//   const { searchQuery } = state;

//   // if(selectedUser ){
//   //   state.todo = loadState().todo.filter((task) => task.assignedTo.includes(selectedUser));
//   //   state.inProgress = loadState().inProgress.filter((task) => task.assignedTo.includes(selectedUser));
//   //   state.completed = loadState().completed.filter((task) => task.assignedTo.includes(selectedUser));
//   // }

 
//   if(searchQuery){
//     state.todo = loadState().todo.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
//     state.inProgress = loadState().inProgress.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
//     state.completed = loadState().completed.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
//   }


// };

export const { addTask,delTask, moveTask, toggleOffCanvas, updatePriority, addProfiles, filterByUser, filterBySearch, taskDetails, setWorkspace } = taskSlice.actions;
export default taskSlice.reducer;

