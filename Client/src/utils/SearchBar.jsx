import React from 'react'
import { CiSearch } from "react-icons/ci";
import { useSelector,useDispatch } from 'react-redux';
import { filterBySearch } from '../redux/features/taskSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.task.searchQuery);

  
  const handleSearchChange = (e) => {
    dispatch(filterBySearch(e.target.value));
  };

  return (

      <div className="searchBar ">
        <input type="search" value={searchQuery}
        onChange={handleSearchChange} className='rounded  form-control searchInput' placeholder='Search Jira' />
        <CiSearch className='position-absolute   fs-5'/>
      </div>

  )
}

export default SearchBar