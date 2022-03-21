import React, { useState } from 'react';
import { getCookie, deleteCookie } from '../helpers/cookies.js';

const UserEdit = ({user, setUser}) => {
    const [form, setForm] = useState({
        username: user.username,
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState([]);
    const [toggleDelete, setToggleDelete] = useState(false);

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

	const updateUser = event => {
		event.preventDefault();

		let token = getCookie('blog_api_token');
        // If no token then unset user, delete cookie, and exit
        if (token === '') {
            setUser();
            deleteCookie('blog_api_token');
            return;
        }

        let options = {
            method: 'POST',
            headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
            body: JSON.stringify({
                username: form.username,
                password: form.password,
                confirmPassword: form.confirmPassword,
                role: user.role
            }),
            mode: 'cors'
        };

        fetch('http://localhost:3000/api/users/' + user.username + '/update', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setFormErrors(res.errors); } // Username/password required
            else {
                // Success. Delete old cookie and log in again
                deleteCookie('blog_api_token');

                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: form.username,
                        password: form.password
                    }),
                    mode: 'cors'
                };
        
                fetch('http://localhost:3000/api/login', options)
                .then(function(res) { return res.json(); })
                .then(function(res) {
                    // Success. Set token as a cookie and redirect to Home page
                    document.cookie = 'blog_api_token=' + res.token + '; SameSite=Lax; path=/';
                    window.location.href = '/';
                });
            }
        });
    };

    const deleteUser = event => {
        event.preventDefault();

        let token = getCookie('blog_api_token');
        // If no token then unset user, delete cookie, and exit
        if (token === '') {
            setUser();
            deleteCookie('blog_api_token');
            return;
        }

        let options = {
            method: 'POST',
            headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
            mode: 'cors'
        };

        fetch('http://localhost:3000/api/users/' + user.username + '/delete', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            // Success. Delete cookie and redirect to Home page
            deleteCookie('blog_api_token');
            window.location.href = '/';
        });
    };

    return(
        <main id="edit">
            {user ?
                <div id="user-edit-container">
                    <form id="user-update-form" action="">
                        <label htmlFor="username">Username:</label>
                        <input type="text" name="username" value={form.username} onChange={handleChange}></input>
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" onChange={handleChange}></input>
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input type="password" name="confirmPassword" onChange={handleChange}></input>
                        <button type="submit" name="submit" onClick={updateUser}>Update</button>
                        {formErrors.length !== 0 ?
                            <ul id="form-errors">
                                {formErrors.map((formError, i) => {
                                    return(
                                        <li key={i}>{formError.msg}</li>
                                    )
                                })}
                            </ul>
                        : null}
                    </form>
                    <button id="delete-btn" onClick={() => {toggleDelete ? setToggleDelete(false) : setToggleDelete(true); }}>Delete</button>
                    {toggleDelete ?
                        <div id="delete-prompt">
                            <div>Are you sure you want to delete your account?</div>
                            <button onClick={deleteUser}>Confirm Delete</button>
                            <button onClick={() => {setToggleDelete(false); }}>Cancel</button>
                        </div>
                    : null}
                </div>
            : null}
        </main>
    );
};

export default UserEdit;