import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Home from "./Home";
import Footer from "./Footer";
import User from "./User";
import UserEdit from "./UserEdit";
import Post from "./Post";
import { getCookie, deleteCookie } from "../helpers/cookies.js";

const App = () => {
	const [user, setUser] = useState();

	// Check authorization on componentDidMount
	useEffect(() => {
		let token = getCookie('blog_api_token');
		// If no token then unset user, delete cookie, and exit
		if (token === '') {
			setUser();
			deleteCookie('blog_api_token');
			return;
		}

		const options = {
			method: 'GET',
			headers: { 'Authorization': 'Bearer ' + token },
			mode: 'cors'
		};

		fetch('http://localhost:3000/api/auth', options)
		.then(function(res) {
			// If unauthorized then unset user, delete cookie, and throw error
			if (res.statusText === 'Unauthorized') {
				setUser();
				deleteCookie('blog_api_token');
				throw new Error(res.statusText);
			} else {
				return res.json();
			}
		})
		.then(function(res) { setUser(res); })
		.catch(err => { console.log(err.message); });
	}, []);

	return(
		<HashRouter>
			<Header user={user} setUser={setUser} deleteCookie={deleteCookie} />
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/login" element={<LogIn />} />
				<Route exact path="/signup" element={<SignUp />} />
				<Route exact path="/users/:username" element={<User user={user} />} />
				<Route exact path="/users/:username/edit" element={<UserEdit user={user} setUser={setUser} />} />
				<Route exact path="/posts/:postId" element={<Post user={user} setUser={setUser} />} />
			</Routes>
			<Footer />
		</HashRouter>
	);
};

export default App;
