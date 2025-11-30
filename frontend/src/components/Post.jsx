import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useState } from "react";

const Post = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };



  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add To Favourites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src="https://img.freepik.com/free-photo/expressive-woman-posing-outdoor_344912-3079.jpg?semt=ais_hybrid&w=740&q=80"
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

      <span className="font-medium block mb-2">1k likes</span>
      <p className="font-medium  mr-2">
        <span>username</span> caption
      </p>
      <span onClick={() => setOpen(true)} className="text-[#606060]">View all comments</span>
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
