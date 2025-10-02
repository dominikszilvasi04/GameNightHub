import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';

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
    <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        minLength="6"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        type="password"
                        name="password2"
                        value={password2}
                        onChange={onChange}
                        minLength="6"
                        required
                    />
                </div>
                <Button type="submit" fullWidth>Register</Button>
            </form>
        </div>
    </div>
  );
};

export default RegisterPage;