import React from 'react'
import { useSelector } from 'react-redux'

const Frame = ({children}) => {
  const {offCanvasToggle} = useSelector(state=>state.task);
  
  return (
    <div className={`body-frame ${offCanvasToggle===true?" body-frame-close":"body-frame-open"}  `}>
          {children}
     </div>
  )
}

  export default Frame