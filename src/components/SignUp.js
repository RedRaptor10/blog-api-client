import React, { useState } from 'react';

const SignUp = () => {
    const [form, setForm] = useState({
        username: '',
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

    const submitForm = event => {
        event.preventDefault();

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: form.username,
                password: form.password,
                confirmPassword: form.confirmPassword,
                role: 'member'
            }),
            mode: 'cors'
        };

        fetch('http://localhost:3000/api/users/create', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setFormErrors(res.errors); } // Username/password required
            else if (!res.user) { setFormErrors([{ msg: res.info.message }]); } // Incorrect username/password
            else {
                // Success. Redirect to Home page
                window.location.href = '/';
            }
        });
    };

	return(
		<main id="sign-up">
            <form id="sign-up-form" action="">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onChange={handleChange}></input>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={handleChange}></input>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" onChange={handleChange}></input>
                <button type="submit" name="submit" onClick={submitForm}>Sign Up</button>
                {formErrors.length !== 0 ?
                    formErrors.map((formError, i) => {
                        return(
                            <div key={i}>{formError.msg}</div>
                        )
                    })
                : null}
            </form>
		</main>
	);
};

export default SignUp;