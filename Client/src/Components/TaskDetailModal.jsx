import React from 'react'
import { useSelector } from 'react-redux'

const TaskDetailModal = () => {
    const task = useSelector(state => state.task.taskDetails);
    console.log(task?._email , "taslk")

  return (
    <>

      <div className="modal fade" id="taskDetailModal" tabIndex={-1} aria-labelledby="taskDetailModal" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">{task?.title}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
    
          <img className='w-100' src={task?.image} alt={task?.title} />
          <div className="my-3">
          <div className='mt-2  fs-6'>
          <p> <span className=' fw-semibold'>Description:</span> &nbsp;  {task?.description}</p>
          </div>
    
          <div className='mt-2  fs-6'>
          <p> <span className=' fw-semibold'>Priority:</span> &nbsp; {task?.priority}</p>
          </div>
          
          <div className='mt-2  fs-6'>
        <div className='fw-semibold'>Assigned To:
            </div>
            <ul className='list-unstyled'>
               {/* my assigned to have other tasks ids */}
                {task?.assignedTo.length>0?
                task?.assignedTo.map((profile, index) => (
                    <li key={profile?._id}> {profile?._email}</li>   
                ))
                :<li className='text-body-secondary'>No one assigned</li>
                }
            </ul>
          </div>
          </div>
        
            
           
    
            
    
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          
          </div>
        </div>
      </div>
    </div>
    

    </>
  )
}

export default TaskDetailModal