import { Outlet } from 'react-router-dom';
import logo from 'src/assets/images/logo.png';

const DonorLayout = () => {
    return (
        <div>
            <div className="fixed top-0 text-center w-full bg-white py-3 shadow-md z-10">
                <img className="w-40 mx-auto" src={logo} alt="meena project logo" />
            </div>
            <div className="bg-[#86c88b]">
                <Outlet />
            </div>
        </div >
    )
};
export default DonorLayout