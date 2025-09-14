import Logo from "src/pages/donation/components/Logo";
import Login from "src/components/Login";

export const Header = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <div></div>
      <Logo />
      <Login />
    </div>
  );
};
