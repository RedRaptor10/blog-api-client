import React, { useState } from 'react';

const UserEdit = ({user, setUser, getCookie, deleteCookie}) => {
    const [form, setForm] = useState({
        username: user.username,
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState([]);

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

        const options = {
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
                // Success. Redirect to Home page
                setUser({
                    _id: user._id,
                    username: form.username,
                    role: user.role
                });

                deleteCookie('blog_api_token');

                const options2 = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: form.username,
                        password: form.password
                    }),
                    mode: 'cors'
                };
        
                fetch('http://localhost:3000/api/login', options2)
                .then(function(res) { return res.json(); })
                .then(function(res) {
                    // Success. Set token as a cookie and redirect to Home page
                    document.cookie = 'blog_api_token=' + res.token + '; SameSite=Lax; path=/';
                    window.location.href = '/';
                });
            }
        });
    };

    return(
        <main id="edit">
            {user ?
                <form id="user-update-form" action="">
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" value={form.username} onChange={handleChange}></input>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" onChange={handleChange}></input>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" name="confirmPassword" onChange={handleChange}></input>
                    <button type="submit" name="submit" onClick={updateUser}>Update</button>
                    {formErrors.length !== 0 ?
                        formErrors.map((formError, i) => {
                            return(
                                <div key={i}>{formError.msg}</div>
                            )
                        })
                    : null}
                </form>
            : null}
        </main>
    );
};

export default UserEdit;