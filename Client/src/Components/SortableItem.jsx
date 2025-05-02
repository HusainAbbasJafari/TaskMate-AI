import React from 'react'
import { useDroppable } from "@dnd-kit/core";

const SortableItem = ({id,children}) => {

  const { setNodeRef, isOver } = useDroppable({ id: id });
  
  const style = {
    backgroundColor: isOver ? 'lightgrey ' : undefined,
    padding: isOver ?'10px':'0px',
    border: isOver ? '1px dashed black' : 'none',
    transition: 'background-color 0.1s ease'
  };
  return (
    
    <div  ref={setNodeRef}  className="d-flex  flex-column gap-2" style={style}>
      {children}
    </div>
   )
}

export default SortableItem