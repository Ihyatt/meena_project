import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <Link to={"/login"} className="cursor-pointer">
        LOGIN
      </Link>
    </>
  );
};
export default Login;
