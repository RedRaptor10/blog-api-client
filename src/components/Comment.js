import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import formatDate from '../helpers/formatDate.js';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const Comment = ({user, setUser, comment, setComments, commentToUpdate, setCommentToUpdate }) => {
    const { postId } = useParams(); // Get post id from url
    const [commentUpdateForm, setCommentUpdateForm] = useState({ content: comment.content });

    const handleUpdateChange = event => {
        setCommentUpdateForm({
            [event.target.name]: event.target.value
        });
    };

    const updateComment = event => {
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
                author: comment.author._id,
                date: comment.date,
                content: commentUpdateForm.content
            }),
            mode: 'cors'
        };

        fetch('http://localhost:3000/api/posts/' + postId + '/comments/' + comment._id + '/update', options)
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
            // Success. Hide update comment form and fetch comments again.
            setCommentToUpdate();

            fetch('http://localhost:3000/api/posts/' + postId + '/comments?sort=date&order=desc', {mode: 'cors'})
            .then(function(res) { return res.json(); })
            .then(function(res) { setComments(res); });
        })
        .catch(err => {
            console.log(err.message);
        });;
    };

    const deleteComment = () => {
        let token = getCookie('blog_api_token');
        // If no token then unset user, delete cookie, and exit
        if (token === '') {
            setUser();
            deleteCookie('blog_api_token');
            return;
        }

        const options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch('http://localhost:3000/api/posts/' + postId + '/comments/' + comment._id + '/delete', options)
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
            // Success. Fetch comments again.
            fetch('http://localhost:3000/api/posts/' + postId + '/comments?sort=date&order=desc', {mode: 'cors'})
            .then(function(res) { return res.json(); })
            .then(function(res) { setComments(res); });
        })
        .catch(err => {
            console.log(err.message);
        });;
    }

    return(
        <div className="comment">
            <span className="comment-author"><Link to={'/users/' + comment.author.username}>{comment.author.username}</Link></span>
            <span className="comment-date">{formatDate(comment.date)}</span>
            {user && user.username === comment.author.username ?
                <span className="comment-controls">
                    <span className="comment-edit" onClick={() => {
                        if (commentToUpdate !== comment._id) {
                            setCommentToUpdate(comment._id);
                        }
                        else {
                            setCommentToUpdate();
                        }}}>Edit</span>
                    <span className="comment-delete" onClick={deleteComment}>Delete</span>
                </span>
            : null}
            {commentToUpdate === comment._id ?
                <form className="comment-update-form" action="">
                    <textarea type="textarea" name="content" onChange={handleUpdateChange} value={commentUpdateForm.content}></textarea>
                    <button type="submit" name="submit" onClick={updateComment}>Update</button>
                </form>
            :
                <p className="comment-content">{comment.content}</p>
            }
        </div>
    );
};

export default Comment;