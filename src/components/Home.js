import React, { useEffect } from "react";
const { DateTime } = require('luxon');

const Home = () => {
	// Get API data on componentDidMount
	useEffect(() => {
		const blogPosts = document.getElementById('blog-posts');
		fetch('http://localhost:3000/api/posts', {mode: 'cors'})
		.then(function(res) { return res.json(); })
		.then(function(res) {
			res.forEach(post => {
				const postEl = document.createElement('div');
				postEl.classList.add('blog-post');

				const title = document.createElement('h1');
				title.classList.add('blog-post-title');
				title.innerHTML = post.title;

				const author = document.createElement('div');
				author.classList.add('blog-post-author');
				author.innerHTML = 'by ' + post.author.username;

				const date = document.createElement('div');
				date.classList.add('blog-post-date');
				date.innerHTML = DateTime.fromJSDate(new Date(post.date)).toLocaleString(DateTime.DATETIME_MED);

				postEl.append(title, author, date);
				blogPosts.append(postEl);
			});
		});
	}, []);

	return(
		<main id="home">
			<div id="blog-posts"></div>
		</main>
	);
};

export default Home;