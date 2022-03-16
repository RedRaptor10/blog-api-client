import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../helpers/formatDate.js';

const Home = () => {
	const [posts, setPosts] = useState([]);

	// Get API data on componentDidMount
	useEffect(() => {
		fetch('http://localhost:3000/api/posts', {mode: 'cors'})
		.then(function(res) { return res.json(); })
		.then(function(res) { setPosts(res); });
	}, []);

	return(
		<main id="home">
			<div id="blog-posts">
				{posts.length !== 0 ?
					posts.map((post) => {
						return(
							<Link to={'/posts/' + post._id} key={post._id}>
								<div className="blog-post">
									<h1 className="blog-post-title">{post.title}</h1>
									by <div className="blog-post-author">{post.author.username}</div>
									<div className="blog-post-date">{formatDate(post.date)}</div>
								</div>
							</Link>
						)
					})
				: null}
			</div>
		</main>
	);
};

export default Home;