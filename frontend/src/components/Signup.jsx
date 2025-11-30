import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate("/");
        toast.success(response.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="flex items-center w-screen h-screen justify-center">
        <form
          onSubmit={handleSubmit}
          action=""
          className="shadow-lg flex flex-col gap-5 p-8"
        >
          <div className="my-4">
            <h1 className="text-xl font-bold text-center">LOGO</h1>
            <p className="text-sm text-gray-500">
              Sign up to see photos and videos from your friends.
            </p>
          </div>
          <div>
            <Label className="font-medium">Username</Label>
            <Input
              type="text"
              name="username"
              value={input.username}
              onChange={handleChange}
              className="focus-visible:ring-transparent my-2"
            />
          </div>
          <div>
            <Label className="font-medium">Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={handleChange}
              className="focus-visible:ring-transparent my-2"
            />
          </div>
          <div>
            <Label className="font-medium">Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={handleChange}
              className="focus-visible:ring-transparent my-2"
            />
          </div>
          {loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit">Sign Up</Button>
          )}
          <span className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Signup;
