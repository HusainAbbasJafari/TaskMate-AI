import React, { useState , useRef } from 'react';
// new
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/features/taskSlice';
import { addformSchema } from '../schemas';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/taskApi';
import useGetUsers from '../hooks/useGetUsers';
import usegetWorkspace from '../hooks/usegetWorkspace';
import SmartInput from './SmartInput';

// changes

const initialValues = {
  title: "",
  description: "",
  priority: "",
  assignedTo: [], // Change from string to array
  image: null,
  workspace:"",
};

const AddForm = () => {
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const {data:usersData,isLoading,isError,error}= useGetUsers();
  const {data:workspaceData,isLoading:workspaceLoading,isError:workspaceIsError,error:workspaceError} = usegetWorkspace();

  const addTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']); // Refetch tasks after adding
    },
    onError: (error) => {
      console.error('Error adding task:', error);
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: addformSchema,
    onSubmit: (values, action) => {
      // dispatch(addTask(values)); // Dispatch task to Redux
      console.log(values,"values");
      addTaskMutation.mutate(values);
      
     
      action.resetForm();
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("addform"));
      if (modal) 
        modal.hide(); // Hide the modal safely
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFieldValue("image", reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAssignedToChange = (e) => {
    const { value } = e.target;
    console.log(value);
    setFieldValue("assignedTo", [...values.assignedTo, value.toString()]);
  };

  return (
    <>
      {/* AddForm-modal */}
      <div
        className="modal fade "
        id="addform"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass">
            <div className="modal-header ">
              <h1
                className="modal-title fs-2 text-light  "
                id="staticBackdropLabel"
              >
                Add Task
              </h1>
              <button
                type="button"
                className="btn-close "
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <SmartInput
                  className="form-control"
                  type="text"
                  id="title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your New Task Title"
                  />
                  <label className="text-secondary" htmlFor="expenseName">
                    Task Name
                  </label>
                  {errors.title && touched.title ? (
                    <div className="form-text text-danger">{errors.title}</div>
                  ) : null}
                </div>

                <div className="form-floating mb-3">
                  {/* <textarea
                    type="text"
                    name="description"
                    className="form-control"
                    id="description"
                    style={{ height: "100px" }}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your New Task Description"
                  /> */}
                  <SmartInput
                  className="form-control textarea"
                  inputFontSize=""
                  type="textarea"
                  id="description"
  name="description"
  value={values.description}
  onChange={handleChange}
  onBlur={handleBlur}
  placeholder="Your New Task Description"
/>
                  <label className="text-secondary" htmlFor="description">
                    Task Description
                  </label>
                  {errors.description && touched.description ? (
                    <div className="form-text text-danger">
                      {errors.description}
                    </div>
                  ) : null}
                </div>

                <div className="mb-3">
                  <select
                    className="form-select"
                    id="workspace"
                    name="workspace"
                    value={values.workspace}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">select Workspace</option>
                    {workspaceData?.map((workspace) => (
                      <option key={workspace._id} value={workspace._id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                  {errors.workspace && touched.workspace ? (
                    <div className="form-text text-danger">
                      {errors.workspace}
                    </div>
                  ) : null}
                </div>

                <div className="mb-3">
                  <select
                    className="form-select"
                    id="priority"
                    name="priority"
                    value={values.priority}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Priority Level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {errors.priority && touched.priority ? (
                    <div className="form-text text-danger">
                      {errors.priority}
                    </div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <select
                    className="form-select"
                    id="assignedTo"
                    name="assignedTo"
                    onChange={handleAssignedToChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Assigned Profile</option>
                    {usersData?.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && touched.assignedTo ? (
                    <div className="form-text text-danger">
                      {errors.assignedTo}
                    </div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="form-control"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    onBlur={handleBlur}
                  />
                  {errors.image && touched.image ? (
                    <div className="form-text text-danger">{errors.image}</div>
                  ) : null}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail mt-2"
                      style={{ maxHeight: "50px" }}
                    />
                  )}
                </div>
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddForm;