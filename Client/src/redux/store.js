import { configureStore } from "@reduxjs/toolkit";

import taskReducer from '../redux/features/taskSlice'
import workspaceReducer from '../redux/features/workspaceSlice'
import userReducer from '../redux/features/userSlice'
export const store = configureStore({
    reducer:{
        task:taskReducer,
        workspace:workspaceReducer,
        user:userReducer
    }
})