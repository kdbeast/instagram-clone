import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";
import { useDispatch } from "react-redux";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const reportPostHandler = () => {
    toast.success("Post reported successfully");
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post.author?.profilePicture}
              alt="post_profileImage"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{post.author?.username}</span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center justify-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add To Favourites
            </Button>
            {user?._id === post.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )}
            {user?._id !== post.author?._id && (
              <Button
                onClick={reportPostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Report
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_image"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaRegHeart className="cursor-pointer hover:text-red-500" size={24} />
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-blue-500"
            size={24}
          />
          <Send className="cursor-pointer hover:text-blue-500" size={24} />
        </div>
        <Bookmark className="cursor-pointer hover:text-blue-500" size={24} />
      </div>

      <span className="font-medium block mb-2">{post.likes.length} likes</span>
      <p>
        <span className="font-medium mr-1">{post.author.username}</span>{" "}
        {post.caption}
      </p>
      <span onClick={() => setOpen(true)} className="text-[#606060]">
        View all comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Add a comment..."
          className="my-2 outline-none rounded-sm w-full p-2"
        />
        {text && <span className="text-[#0095F6] cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;
