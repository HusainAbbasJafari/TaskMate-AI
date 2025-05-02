import * as Yup from "yup";

export const addformSchema = Yup.object({
  title: Yup.string().min(2).max(25).required("Please enter task title"),
  description: Yup.string().min(2).max(10000).required("Please enter your task description"),
  priority: Yup.string().required("Please select your priority level"),
  assignedTo: Yup.array().required("Please select your assigned profile"),
  image: Yup.mixed().required("Please upload an image"),
  workspace:Yup.string().required("Please select your workspace"),
});


export const loginFormSchema = Yup.object({
  email: Yup.string().email().required("Please enter valid email"),
  password: Yup.string().min(4).max(100).required("lease enter valid password"),
});

export const signUpFormSchema = Yup.object({
  username: Yup.string().min(3).max(100).required("Please enter your username"),
  email: Yup.string().email().required("Please enter valid email"),
  password: Yup.string().min(4).max(100).required("lease enter valid password"),
});


