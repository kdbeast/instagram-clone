import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosts } from "../redux/postSlice";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchAllPost();
  }, [dispatch]);
};

export default useGetAllPost;
