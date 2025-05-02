import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";


// const loggedInUser = localStorage.getItem("token");
//   const decodedToken = loggedInUser ? jwtDecode(loggedInUser) : null;

const initialState = {
  registeredUsers: [],
  decodedToken: null, //  Decoded JWT payload
  loggedInUser: null,  // Logged-in user data
  token: null          // Raw JWT token
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRegisteredUsers: (state, action) => {
      state.registeredUsers =action.payload; // { id, name, email }
    },
    getLoggedInUser: (state, action) => {
      console.log("getLoggedInUser action payload:", action.payload); // Log the action payload
      const token  = action.payload; // Get the token from the action payload
      if (token) {
        state.token = token; // Set the token in the state
        const decodedToken = jwtDecode(token); // Decode the token to get user ID
        
        console.log("Decoded Token:", decodedToken); // Log the decoded token
         // Check if the token is valid and contains user ID
        state.decodedToken = decodedToken;

         // Set the decoded token in the state
        const loggedInUser = state.registeredUsers?.find((user)=>user?._id === decodedToken._id); 
        console.log("Logged In User redux:", loggedInUser); // Log the logged-in user data
        // console.log(loggedInUser," loggedInUser"); // Log the logged-in user data
        state.loggedInUser = loggedInUser;
        // state.loggedInUser = loggedInUser; // Set the logged-in user in the state
        
      }

      

  },

  logoutUser:(state, action)=>{
    state.loggedInUser = null; // Clear the logged-in user data
    state.decodedToken = null; // Clear the decoded token
    state.token = null; // Clear the token

  },
  }

});

export const { setRegisteredUsers, getLoggedInUser,logoutUser } = userSlice.actions;
export default userSlice.reducer;
