import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import LogIn from "./LogIn";
import Home from "./Home";
import Footer from "./Footer";
import User from "./User";
import Post from "./Post";

const App = () => {
	const [user, setUser] = useState();

	// Get cookie from string: document.cookie == 'cookie1=value; cookie2=value;'
	const getCookie = cname => {
		let name = cname + '=';
		let decodedCookie = decodeURIComponent(document.cookie); // Decode document.cookie to handle cookies with special characters, e.g. '$'
		let cookieArray = decodedCookie.split(';');
		// Loop through cookieArray and read each cookie
		for (let i = 0; i < cookieArray.length; i++) {
			let c = cookieArray[i];
			while (c.charAt(0) === ' ') { c = c.substring(1); }
			// If cookie is found, return the cookie value
			if (c.indexOf(name) === 0) { return c.substring(name.length, c.length); }
		}
		// Cookie not found, return empty string
		return '';
	};

	// Delete cookie by setting expires parameter to past date (NOTE: Cookie value does not have to be specified)
	const deleteCookie = cname => {
		document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; path=/';
	}

	// Check authorization on componentDidMount
	useEffect(() => {
		const checkAuth = () => {
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
			.then(function(res) {
				setUser(res);
			})
			.catch(err => {
				console.log(err.message);
			});
		};

		checkAuth();
	}, []);

	return(
		<HashRouter>
			<Header user={user} />
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/login" element={<LogIn />} />
				<Route exact path="/users/:username" element={<User />} />
				<Route exact path="/posts/:postId" element={<Post />} />
			</Routes>
			<Footer />
		</HashRouter>
	);
};

export default App;
