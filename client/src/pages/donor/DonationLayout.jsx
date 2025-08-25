import { Outlet } from 'react-router-dom';
import logo from 'src/assets/images/logo.png';

const DonorLayout = () => {
    return (
        <div>
            <Outlet />  
        </div >
    )
};
export default DonorLayout