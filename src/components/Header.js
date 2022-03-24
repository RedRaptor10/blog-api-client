import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({user, setUser, deleteCookie}) => {
    const logOut = () => {
        fetch(process.env.REACT_APP_SERVER + 'api/logout', {mode: 'cors'})
        .then(function() {
            setUser();
            deleteCookie('blog_api_token');
            window.location.href = '/';
        });
    };

    return(
        <header>
            <h1>
                <Link to="/">Blog</Link>
            </h1>
            {user ?
                <div>
                    <Link to={`/users/${user.username}`}>
                        <button>{user.username}</button>
                    </Link>
                    <button onClick={logOut}>Log Out</button>
                </div>
            :
                <div>
                    <Link to="/login">
                        <button>Log In</button>
                    </Link>
                    <Link to="/signup">
                        <button>Sign Up</button>
                    </Link>
                </div>
            }
        </header>
    );
};

export default Header;