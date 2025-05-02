import React from "react";
import AddForm from "../Components/AddForm";
import TaskDetailModal from "../Components/TaskDetailModal";
import Homeheader from "../Components/Homeheader";
import Kanbanheader from "../Components/Kanbanheader";
import Dnd from "../Components/Dnd";
import AllUserModel from "../Components/AllUserModel";
import ChatBot from "../Components/chatBot";

const Home = () => {

  return (

      <div className="home-container">     
       <Homeheader/>

        <Kanbanheader/>
        <Dnd/>
        
        <AddForm />
        <TaskDetailModal />
        <AllUserModel/>
        <ChatBot/>
     
      </div>
    
  );
};

export default Home;
