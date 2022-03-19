import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const User = ({user}) => {
    const { username } = useParams(); // Get username from url
	const [profile, setProfile] = useState({});

	// Get API data on componentDidUpdate
	useEffect(() => {
		fetch('http://localhost:3000/api/users/' + username, {mode: 'cors'})
		.then(function(res) { return res.json(); })
		.then(function(res) { setProfile(res); });
	}, [username]);

	return(
		<main id="user">
			{profile ?
				<div id="user-info">
					<div>{profile.username}</div>
					<div>{profile.role}</div>
					{user ?
						<Link to={`/users/${user.username}/edit`}>Edit</Link>
					: null}
				</div>
            : null}
		</main>
	);
};

export default User;