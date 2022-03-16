import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";

const App = () => {
	return(
		<HashRouter>
			<Header />
			<Routes>
				<Route exact path="/" element={<Home />} />
			</Routes>
			<Footer />
		</HashRouter>
	);
};

export default App;
