import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/user/suggested-users",
          { withCredentials: true }
        );
        console.log(res.data);
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.suggestedUsers));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, [dispatch]);
};
export default useGetSuggestedUsers;
