import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = ({user}) => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState([]);
    const navigate = useNavigate();

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

        fetch(process.env.REACT_APP_SERVER + 'api/users/create', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setFormErrors(res.errors); } // Username/password required
            else if (!res.user) { setFormErrors([{ msg: res.info.message }]); } // Incorrect username/password
            else {
                // Success. Redirect to Log In page
                navigate('/login');
            }
        });
    };

	return(
        !user ?
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
        : null
	);
};

export default SignUp;