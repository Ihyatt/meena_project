import { Link } from 'react-router-dom';

const NotFound = () => {

    return (
        <div >
            <h1> 404 </h1>
            <p>
                Oops! The page you're
                looking for is not here.
            </p>
            <nav>
                <Link to="/">Donate Page</Link>
            </nav>
        </div>
    );
};

export default NotFound;