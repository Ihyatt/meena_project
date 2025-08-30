import logo from "src/assets/images/logo.png";

export const Header = () => {
  return (
    <div className="w-full ">
      <div className=" flex  items-center justify-center pt-6 ">
        <img src={logo} alt="Logo" className="h-10" />
      </div>
    </div>
  );
};
