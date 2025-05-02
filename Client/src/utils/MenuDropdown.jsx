import React, { useState } from 'react'
import { FaAngleLeft ,FaAngleRight} from "react-icons/fa6";
import { FaAngleDown,FaAngleUp } from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";
import { FcTimeline } from "react-icons/fc";
import { CiViewBoard } from "react-icons/ci";
import { CiCircleList } from "react-icons/ci";
import { FaWpforms } from "react-icons/fa6";
import { GoGoal } from "react-icons/go";
import { IoIosAdd } from "react-icons/io";

const MenuDropdown = ({heading}) => {
    const [toggle,setToggle]=useState(true);
  return (
      <div className="myCanvas-Menu">
       <h6 className='text-secondary fw-bold'>
          <span onClick={()=>setToggle(!toggle)} >
            {toggle?<FaAngleDown/>:<FaAngleUp/>
            }
             </span>  {heading}
       </h6>
  {toggle?
   <ul className='list-unstyled myCanvas-menu'>
   <li><CiGlobe/> Browser</li>
   <li><FcTimeline/> Timeline</li>
   <li> <CiViewBoard/> Board</li>
   <li> <CiCircleList/>List</li>
   <li> <FaWpforms/>Forms</li>
   <li><GoGoal/>Goals</li>

   <li> <IoIosAdd/> Add new</li>
   <li></li>
   <li></li>
   <li></li>
</ul>
:""
  }
      
       
      </div>
   
  )
}

export default MenuDropdown