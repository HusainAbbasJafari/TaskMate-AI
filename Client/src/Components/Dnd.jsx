import React, { useState } from "react";
import TaskCard from "../Components/TaskCard";
import SortableItem from "../Components/SortableItem";
import { useSelector, useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import useTasks from "../hooks/useTasks";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { taskDetails } from "../redux/features/taskSlice";
import axiosInstance from "../api/axiosInstance";

const Dnd = () => {
  const dispatch = useDispatch();
  const { selectedWorkspace, searchQuery, selectedUser } = useSelector((state) => state.task); // Get workspace, searchQuery, and selectedUser from Redux
  const queryClient = useQueryClient();
  const { data: taskData = [], isLoading, error } = useTasks(selectedWorkspace?._id); // Fetch tasks for the selected workspace

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
      },
    }),
    useSensor(KeyboardSensor)
  );

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-danger">Error: {error.message}</p>;
  }

  // Filter tasks based on search query and selected user
  const filteredTasks = taskData.filter((task) => {
    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUser = selectedUser ? task.assignedTo?.includes(selectedUser) : true;
    return matchesSearch && matchesUser;
  });

  // Categorize tasks
  const todo = filteredTasks.filter((task) => task.status === "To Do");
  const inProgress = filteredTasks.filter((task) => task.status === "In Progress");
  const completed = filteredTasks.filter((task) => task.status === "Completed");

  const onDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

const isSameStatus = (activeId, overId) => {
  console.log(activeId,overId,"Same STATUS activeId,overId")
    const activeTask = [...todo, ...inProgress, ...completed].find((task) => task._id === activeId);
    const overTask = [...todo, ...inProgress, ...completed].find((task) => task._id === overId);
    console.log(activeTask,overTask,"Same STATUS activeTask,overTask")
    if(overTask){
      return activeTask.status === overTask.status;
    }else if(overId === activeTask.status){
return true;
    }else{
      return false;
    }
  };

  const onDragEnd = (event) => {

    const { active, over } = event;
    setActiveId(null);
    isSameStatus(active.id,over.id);

    if (!over || active.id === over.id || isSameStatus(active.id,over.id) ) return;

    const newStatus = over.id; // Get the new status from the drop target
    const taskId = active.id;

    // Update the task's status in the backend
    axiosInstance
      .put(`/tasks/${taskId}/update-status`, { status: newStatus })
      .then(() => {
        queryClient.invalidateQueries(["tasks", selectedWorkspace?._id]); // Refetch tasks
      })
      .catch((error) => {
        console.error("Error updating task status:", error.response?.data || error.message);
      });
  };

  const renderDragOverlay = () => {
    if (!activeId) return null;
    const activeTask = [...todo, ...inProgress, ...completed].find(
      (task) => task._id === activeId
    );
    return <TaskCard {...activeTask} />;
  };

  const handleTaskDetail = (id) => {
    const task = taskData?.find((task) => task._id === id);
    dispatch(taskDetails(task));
  };

  return (

    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="row border task-body py-2">

        <div className="col-6 col-lg-4">
          <SortableContext items={todo.map((task) => task._id)} strategy={verticalListSortingStrategy}>
            <SortableItem id="To Do">
              {todo.map((task) => (
                <TaskCard
                  key={task._id} // Ensure the key is unique
                  id={task._id}
                  handleClick={() => handleTaskDetail(task._id)}
                  title={task.title}
                  description={task.description}
                  priority={task.priority}
                  assignedTo={task.assignedTo}
                  image={task.image}
                />
              ))}
            </SortableItem>
          </SortableContext>
        </div>


        <div className="col-6 col-lg-4">
          <SortableContext items={inProgress.map((task) => task._id)} strategy={verticalListSortingStrategy}>
            <SortableItem id="In Progress">
              {inProgress.map((task) => (
                <TaskCard
                  key={task._id} // Ensure the key is unique
                  id={task._id}
                  handleClick={() => handleTaskDetail(task._id)}
                  title={task.title}
                  description={task.description}
                  priority={task.priority}
                  assignedTo={task.assignedTo}
                  image={task.image}
                />
              ))}
            </SortableItem>
          </SortableContext>
        </div>


        <div className="col-6 col-lg-4">
          <SortableContext items={completed.map((task) => task._id)} strategy={verticalListSortingStrategy}>
            <SortableItem id="Completed">
              {completed.map((task) => (
                <TaskCard
                  key={task._id} // Ensure the key is unique
                  id={task._id}
                  handleClick={() => handleTaskDetail(task._id)}
                  title={task.title}
                  description={task.description}
                  priority={task.priority}
                  assignedTo={task.assignedTo}
                  image={task.image}
                />
              ))}
            </SortableItem>
          </SortableContext>
        </div>

      </div>

      <DragOverlay>{renderDragOverlay()}</DragOverlay>
    </DndContext>
  );
};

export default Dnd;
