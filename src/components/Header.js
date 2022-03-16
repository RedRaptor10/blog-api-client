import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return(
        <header>
            <h1>
                <Link to="/">Blog</Link>
            </h1>
            <Link to="/login">Log In</Link>
        </header>
    );
};

export default Header;