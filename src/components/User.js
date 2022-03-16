import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const User = () => {
    const { username } = useParams(); // Get username from url
    const [ user, setUser ] = useState({});

	// Get API data on componentDidUpdate
	useEffect(() => {
		fetch('http://localhost:3000/api/users/' + username, {mode: 'cors'})
		.then(function(res) { return res.json(); })
		.then(function(res) { setUser(res); });
	}, [username]);

	return(
		<main id="user">
            {user ?
                <div id="user-info">
                    <div>{user.username}</div>
                    <div>{user.role}</div>
                </div>
            : null}
		</main>
	);
};

export default User;