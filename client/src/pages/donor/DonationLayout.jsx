import { Outlet } from 'react-router-dom';
import logo from 'src/assets/images/logo.png';

const DonorLayout = () => {
    return (
        <div>
            <div className="fixed top-0 w-full bg-white py-3 shadow-md z-10 flex items-center justify-center">
            <img className="w-40" src={logo} alt="meena project logo" />
            <div className="absolute right-6 flex space-x-6 text-gray-700 font-medium">
                <div>mission</div>
                <div>volunteer</div>
                <div>donate</div>
            </div>
        </div>
            <div className="bg-[#86c88b]">
                <Outlet />
            </div>
        </div >
    )
};
export default DonorLayout