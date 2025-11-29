import { Label } from "@radix-ui/react-label";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  return (
    <>
      <div className="flex items-center w-screen h-screen justify-center">
        <form action="">
          <div className="">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" />
          </div>
          <div className="">
            <Button>Login</Button>
          </div>
          <div className="">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <div className="">
            <Button>Register</Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
