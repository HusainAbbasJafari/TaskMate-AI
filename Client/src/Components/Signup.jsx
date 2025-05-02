import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import { signUpFormSchema } from '../schemas';
// import { signup } from '../api';
import { signup } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';

const initialValues = {
  username: "",
  email: "",
  password: "",
};

const Signup = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(''); // Add error state

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: signUpFormSchema,
    onSubmit: async (values, action) => {
      try {
        const response = await signup(values);
        navigate('/login'); // Navigate to login page after successful signup
        console.log(response);
      } catch (error) {
        setApiError(error.response?.data?.message || 'An error occurred'); // Set error message
      }
    }
  });

  return (
    <>
      <div className="form-bg">
        <form onSubmit={handleSubmit} className='glass loginform shadow p-4 rounded-3'>
          <h2 className='text-center mb-3'>Sign Up</h2>
          {apiError && <div className="alert alert-danger">{apiError}</div>} {/* Display error message */}
          <div className="form-floating mb-3">
            <input type="text" name='username' className="form-control" id='username' value={values.username} onChange={handleChange} onBlur={handleBlur} placeholder="Please enter your username" />
            <label className='text-secondary' htmlFor="username">Username</label>
            {errors.username && touched.username ? <div className="form-text text-danger">{errors.username}</div> : null}
          </div>
          <div className="form-floating mb-3">
            <input type="email" name='email' className="form-control" id='email' value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="Please enter your email" />
            <label className='text-secondary' htmlFor="email">Email</label>
            {errors.email && touched.email ? <div className="form-text text-danger">{errors.email}</div> : null}
          </div>
          <div className="form-floating mb-3">
            <input type="password" name='password' className="form-control" id='password' value={values.password} onChange={handleChange} onBlur={handleBlur} placeholder="Please enter your password" />
            <label className='text-secondary' htmlFor="password">Password</label>
            {errors.password && touched.password ? <div className="form-text text-danger">{errors.password}</div> : null}
          </div>
          <div className='d-flex justify-content-center align-items-center flex-column'>
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
          <Link className='text-white' to="/login"><div className="text-center text-decoration-underline fs-6 fw-light">or Login</div></Link>
        </form>
      </div>
    </>
  );
};

export default Signup;