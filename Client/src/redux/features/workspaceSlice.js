import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentWorkspace :  null,
}


const workspaceSlice = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    setCurrWorkspace: (state, action) => {
     state.currentWorkspace = action.payload
    },

  },
});



export const { setCurrWorkspace} = workspaceSlice.actions;
export default workspaceSlice.reducer;

