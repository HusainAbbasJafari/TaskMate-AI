
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/auth'
const useGetUsers = () => {

   const {data,isLoading,isError,error}= useQuery({
        queryKey:['users'],
        queryFn:getUsers
    })
  return {data,isLoading,isError,error}
}

export default useGetUsers;