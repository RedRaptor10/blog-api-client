import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const User = ({user}) => {
    const { username } = useParams(); // Get username from url
	const [profile, setProfile] = useState({});

	// Get API data on componentDidUpdate
	useEffect(() => {
		fetch(process.env.REACT_APP_SERVER + 'api/users/' + username, {mode: 'cors'})
		.then(function(res) { return res.json(); })
		.then(function(res) { setProfile(res); });
	}, [username]);

	return(
		<main id="user">
			<h1>User Profile</h1>
			<hr />
			<div>Username: {profile.username}</div>
			<div>Role: {profile.role}</div>
			{user && user.username === profile.username ?
				<div>
					<Link to={`/users/${user.username}/edit`}>Edit Profile</Link>
				</div>
			: null}
		</main>
	);
};

export default User;