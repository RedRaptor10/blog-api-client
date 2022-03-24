import React, { useState } from 'react';

const LogIn = () => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState([]);

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const submitForm = event => {
        event.preventDefault();

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: form.username,
                password: form.password
            }),
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/login', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setFormErrors(res.errors); } // Username/password required
            else if (!res.user) { setFormErrors([{ msg: res.info.message }]); } // Incorrect username/password
            else {
                // Success. Set token as a cookie and redirect to Home page
                document.cookie = 'blog_api_token=' + res.token + '; SameSite=Lax; path=/';
                window.location.href = '/';
            }
        });
    };

	return(
		<main id="log-in">
            <form id="log-in-form" action="">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onChange={handleChange}></input>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={handleChange}></input>
                <button type="submit" name="submit" onClick={submitForm}>Log In</button>
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
		</main>
	);
};

export default LogIn;