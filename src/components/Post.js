import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import formatDate from '../helpers/formatDate.js';

const Post = () => {
    const { postId } = useParams(); // Get post id from url
    const [ post, setPost ] = useState({});
    const [ comments, setComments ] = useState([]);

	// Get API data on componentDidUpdate
	useEffect(() => {
		fetch('http://localhost:3000/api/posts/' + postId, {mode: 'cors'})
		.then(function(res) { return res.json(); })
        .then(function(res) { setPost(res); });

        fetch('http://localhost:3000/api/posts/' + postId + '/comments', {mode: 'cors'})
        .then(function(res) { return res.json(); })
        .then(function(res) { setComments(res); });
	}, [postId]);

	return(
		<main id="post">
            {post && post.author ?
                <div id="post-container">
                    <div id="post-info">
                        <div>{post.title}</div>
                        <div>by <Link to={'/users/' + post.author.username}>{post.author.username}</Link></div>
                        <div>{formatDate(post.date)}</div>
                        <div>{post.content}</div>
                    </div>
                    <div id="post-comments">
                        {comments.length !== 0 ?
                            comments.map(comment => {
                                return(
                                    <div className="comment" key={comment._id}>
                                        <div>{comment.title}</div>
                                        <div>by <Link to={'/users/' + comment.author.username}>{comment.author.username}</Link></div>
                                        <div>{formatDate(comment.date)}</div>
                                        <div>{comment.content}</div>
                                    </div>
                                )
                            })
                        : null}
                    </div>
                </div>
            : null}
		</main>
	);
};

export default Post;