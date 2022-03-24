import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../helpers/formatDate.js';

const Home = () => {
	const [posts, setPosts] = useState([]);

	// Get API data on componentDidMount
	useEffect(() => {
		fetch(process.env.SERVER + 'api/posts?sort=date&order=desc', {mode: 'cors'})
		.then(function(res) { return res.json(); })
		.then(function(res) { setPosts(res); });
	}, []);

	return(
		<main id="home">
			<div id="blog-posts">
				{posts.length !== 0 ?
					posts.map((post) => {
						return(
							post.published ?
								<Link className="blog-post-container" to={'/posts/' + post._id} key={post._id}>
									<div className="blog-post">
										<div className="blog-post-cover" style={{background: post.cover}}></div>
										<div className="blog-post-info">
											<h1 className="blog-post-title">{post.title}</h1>
											by <span className="blog-post-author">{post.author.username}</span>
											<div className="blog-post-date">{formatDate(post.date)}</div>
										</div>
									</div>
								</Link>
							: null
						)
					})
				: null}
			</div>
		</main>
	);
};

export default Home;