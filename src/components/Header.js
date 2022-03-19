import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({user, setUser, deleteCookie}) => {
    const logOut = () => {
        fetch('http://localhost:3000/api/logout', {mode: 'cors'})
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
                    <Link to={`/users/${user.username}`}>{user.username}</Link>
                    <div onClick={logOut}>Log Out</div>
                </div>
            :
                <div>
                    <Link to="/login">Log In</Link>
                    <Link to="/signup">Sign Up</Link>
                </div>
            }
        </header>
    );
};

export default Header;