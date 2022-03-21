import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import formatDate from '../helpers/formatDate.js';
import Comment from './Comment';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const Post = ({user, setUser}) => {
    const { postId } = useParams(); // Get post id from url
    const [post, setPost] = useState({});
    const [form, setForm] = useState({ content: '' });
    const [formErrors, setFormErrors] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentToUpdate, setCommentToUpdate] = useState();

    // Get API data on componentDidUpdate
	useEffect(() => {
        fetch('http://localhost:3000/api/posts/' + postId, {mode: 'cors'})
		.then(function(res) { return res.json(); })
        .then(function(res) { setPost(res); });

        fetch('http://localhost:3000/api/posts/' + postId + '/comments?sort=date&order=desc', {mode: 'cors'})
        .then(function(res) { return res.json(); })
        .then(function(res) { setComments(res); });
    }, [postId]);

    const handleChange = event => {
        setForm({
            [event.target.name]: event.target.value
        });
    };

    const submitForm = event => {
        event.preventDefault();

        let token = getCookie('blog_api_token');
        // If no token then unset user, delete cookie, and exit
        if (token === '') {
            setUser();
            deleteCookie('blog_api_token');
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post: postId,
                author: user.id,
                date: new Date(),
                content: form.content
            }),
            mode: 'cors'
        };

        fetch('http://localhost:3000/api/posts/' + postId + '/comments/create', options)
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
            if (res.errors) { setFormErrors(res.errors); } // Comment required
            else {
                // Success. Reset form content and fetch comments again.
                let commentFormInput = document.getElementById('comment-form-input');
                commentFormInput.value = '';
                setForm({ content: '' });
                setFormErrors([]);

                fetch('http://localhost:3000/api/posts/' + postId + '/comments?sort=date&order=desc', {mode: 'cors'})
                .then(function(res) { return res.json(); })
                .then(function(res) { setComments(res); });
            }
        })
        .catch(err => {
            console.log(err.message);
        });;
    };

	return(
        post && post.author ?
            <main id="post">
                <div id="post-info">
                    <h1 id="post-title">{post.title}</h1>
                    <div id="post-author">by <Link to={'/users/' + post.author.username}>{post.author.username}</Link></div>
                    <div id="post-date">{formatDate(post.date)}</div>
                    <p id="post-content">{post.content}</p>
                </div>
                <hr />
                <div id="post-comments">
                    <h3 id="post-comments-title">Comments</h3>
                    {!user ?
                        <div id="post-comments-prompt">
                            <Link to="/login">Log In</Link> or&nbsp;
                            <Link to="/signup">Sign Up</Link> to comment on this post.
                        </div>
                    : null}
                    {user ?
                        <form id="comment-form" action="">
                            <label htmlFor="content">Post a Comment</label>
                            <textarea id="comment-form-input" type="textarea" name="content" onChange={handleChange}></textarea>
                            <button type="submit" name="submit" onClick={submitForm}>Submit</button>
                            {formErrors.length !== 0 ?
                                formErrors.map((formError, i) => {
                                    return(
                                        <p key={i}>{formError.msg}</p>
                                    )
                                })
                            : null}
                        </form>
                    : null}
                    {comments.length !== 0 ?
                        comments.map(comment => {
                            return(
                                <Comment key={comment._id} user={user} setUser={setUser} comment={comment} setComments={setComments}
                                    commentToUpdate={commentToUpdate} setCommentToUpdate={setCommentToUpdate} />
                            )
                        })
                    : null}
                </div>
            </main>
        : null
	);
};

export default Post;