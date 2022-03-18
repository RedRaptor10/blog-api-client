import React from 'react';
import { useParams, Link } from 'react-router-dom';
import formatDate from '../helpers/formatDate.js';

const Comment = ({user, setUser, comment, comments, setComments, getCookie, deleteCookie }) => {
    const { postId } = useParams(); // Get post id from url

    const deleteComment = commentId => {
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

        fetch('http://localhost:3000/api/posts/' + postId + '/comments/' + commentId + '/delete', options)
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
            <div>{comment.title}</div>
            <div>by <Link to={'/users/' + comment.author.username}>{comment.author.username}</Link></div>
            <div>{formatDate(comment.date)}</div>
            <div>{comment.content}</div>
            {user && user.username === comment.author.username ?
                <div onClick={() => { deleteComment(comment._id); }}>Delete</div>
            : null}
        </div>
    );
};

export default Comment;