import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { useDispatch } from "react-redux";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
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
    setOpen(false);
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
          {post.author?._id === user?._id && (
            <Badge variant="secondary">Author</Badge>
          )}
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
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              className="cursor-pointer text-red-500"
              size={24}
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              className="cursor-pointer hover:text-red-500"
              size={24}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-blue-500"
            size={24}
          />
          <Send className="cursor-pointer hover:text-blue-500" size={24} />
        </div>
        <Bookmark className="cursor-pointer hover:text-blue-500" size={24} />
      </div>

      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-1">{post.author.username}</span>{" "}
        {post.caption}
      </p>
      {post.comments.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-[#606060] cursor-pointer hover:text-blue-500"
        >
          View all {post.comments.length} comments
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Add a comment..."
          className="my-2 outline-none rounded-sm w-full p-2"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#0095F6] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
