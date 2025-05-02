import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { loginFormSchema } from '../schemas';
// import { login } from '../api';
import {login } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const { login: loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(''); // Add error state

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: loginFormSchema,
    onSubmit: async (values, action) => {
      try {
        const response = await login(values);
        loginUser(response.token);
        navigate('/'); // Navigate to home page after successful login
      } catch (error) {
        setApiError(error.response?.data?.message || 'An error occurred'); // Set error message
      }
    }
  });

  return (
    <>
      <div className="form-bg">
        <form onSubmit={handleSubmit} className='glass loginform shadow p-4 rounded-3'>
          <h2 className='text-center mb-3'>Login</h2>
          {apiError && <div className="alert alert-danger">{apiError}</div>} {/* Display error message */}
          <div className="form-floating mb-3">
            <input type="email" name='email' className="form-control" id='email' value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="Please enter your email" />
            <label className='text-secondary' htmlFor="email">Email</label>
            {errors.email && touched.email ? <div className="form-text text-danger">{errors.email}</div> : null}
          </div>
          <div className="form-floating mb-3">
            <input type="password" name='password' className="form-control" id='password' value={values.password} onChange={handleChange} onBlur={handleBlur} placeholder="Please enter your email" />
            <label className='text-secondary' htmlFor="password">Password</label>
            {errors.password && touched.password ? <div className="form-text text-danger">{errors.password}</div> : null}
          </div>
          <div className='d-flex justify-content-center align-items-center flex-column'>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
          <Link className='text-white' to="/signup"><div className="text-center text-decoration-underline fs-6 fw-light">or Signup</div></Link>
        </form>
      </div>
    </>
  );
};

export default Login;