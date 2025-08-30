import logo from "src/assets/images/logo.png";

const Header = () => {
  return (
    <div className="w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-10" />
        <h1 className="text-xl font-bold text-gray-800">Donation Platform</h1>
        <div></div>
      </div>
    </div>
  );
};
export default Header;
