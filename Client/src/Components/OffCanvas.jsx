import React, { useState } from 'react'

import { FaAngleLeft ,FaAngleRight} from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";
import { FcTimeline } from "react-icons/fc";
import { CiViewBoard } from "react-icons/ci";
import { CiCircleList } from "react-icons/ci";
import { FaWpforms } from "react-icons/fa6";
import { GoGoal } from "react-icons/go";
import { IoIosAdd } from "react-icons/io";
import MenuDropdown from '../utils/MenuDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { toggleOffCanvas } from '../redux/features/taskSlice';

const OffCanvas = () => {

    const {loggedInUser:user} = useSelector(state=>state.user)
    const {offCanvasToggle} = useSelector(state=>state.task)
    const dispatch = useDispatch();


  return (
   <>

  <div className={`myOffcanvas  ${offCanvasToggle === false ? "closeCanvas" : ""}`} id="offcanvasScrolling">

<div className="myCanvas-content ">

<div className="myCanvas-header  pb-2 border-bottom  gap-3">
    <img className='project-img' src="/Images/dummy.jpg" alt="project-pic" /> 
    <div className="text-start">
        <div>
            {user?.username}
        </div>
        <div className="text-secondary">
            Project-Jira
        </div>
    </div>

   </div>

<div className="myCanvas-body">
    <MenuDropdown heading={'Planning'}/>
    <MenuDropdown heading={'Development'}/>   
  
</div>
    
</div>
  
  


   

    <div onClick={()=>dispatch(toggleOffCanvas())}>
        {
            offCanvasToggle? <FaAngleLeft className='right-arrow'  />: <FaAngleRight className='right-arrow'  />
        }
   
    </div>
    

  </div>


   </>

  )
}

export default OffCanvas