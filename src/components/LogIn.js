import React, { useState } from 'react';

const LogIn = () => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });

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

        fetch('http://localhost:3000/api/login', options)
        .then(function(res) { return res.json(); })
        .then(function(res) { console.log(res); });
    };

	return(
		<main id="log-in">
            <form action="">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onChange={handleChange}></input>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={handleChange}></input>
                <button type="submit" name="submit" onClick={submitForm}>Log In</button>
            </form>
		</main>
	);
};

export default LogIn;