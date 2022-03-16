import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import LogIn from "./LogIn";
import Home from "./Home";
import Footer from "./Footer";
import User from "./User";
import Post from "./Post";

const App = () => {
	return(
		<HashRouter>
			<Header />
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
