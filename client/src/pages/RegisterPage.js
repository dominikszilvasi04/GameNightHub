import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Form.css'; 

const RegisterPage = () => {
    // useNavigate is a hook for programmatic navigation
    const navigate = useNavigate();

    // useState hook to manage our form's state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '' // For password confirmation
    });

    const { username, email, password, password2 } = formData;

    // This function is called every time a user types in an input field
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // This function is called when the form is submitted
    const onSubmit = async e => {
        e.preventDefault(); // Prevents the page from reloading

        if (password !== password2) {
            alert('Passwords do not match');
        } else {
            const newUser = { username, email, password };
            try {
                const res = await api.post('/users/register', newUser);
                console.log(res.data);
                alert('Registration successful! Please log in.');
                navigate('/login'); // Redirect to login page
            } catch (err) {
                if (err.response) {
                    // The server responded with an error (e.g., user already exists)
                    console.error(err.response.data);
                    alert(err.response.data.msg);
                } else if (err.request) {
                    // The request was made but no response was received (e.g., server is down)
                    console.error(err.request);
                    alert('Could not connect to the server. Please make sure it is running.');
                } else {
                    // Something else went wrong in setting up the request
                    console.error('Error', err.message);
                    alert(err.message);
                }
            }
        }
    };

    return (
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        minLength="6"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="password2"
                        value={password2}
                        onChange={onChange}
                        minLength="6"
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;