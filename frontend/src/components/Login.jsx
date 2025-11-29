import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Link, useNavigate } from "react-router";

function Login() {
  const [input, setInput] = useState({
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
        "http://localhost:8000/api/v1/user/login",
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
              Login to see photos and videos from your friends.
            </p>
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
            <Button type="submit">Login</Button>
          )}
          <span className="text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Sign Up
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}

export default Login;
