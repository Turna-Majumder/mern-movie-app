import React, { useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '../redux/userSlice';

const Login = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector(store => store.app.isLoading);

    const loginHandler = () => {
        setIsLogin(!isLogin);
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${API_END_POINT}/logout`);
            if (res.data.success) {
                toast.success(res.data.message);
            }
            dispatch(setUser(null));
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const getInputData = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        if (isLogin) {
            // Login
            const user = { email, password };
            try {
                const res = await axios.post(`${API_END_POINT}/login`, user, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (res.data.success) {
                    toast.success(res.data.message);
                    dispatch(setUser(res.data.user));

                    // Set timeout for automatic logout after 10 seconds
                    setTimeout(() => {
                        logoutHandler();
                    }, 120000);

                    navigate("/browse");
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
                toast.error(errorMessage);
            }
            finally {
                dispatch(setLoading(false));
            }
        } else {
            // Register
            dispatch(setLoading(true));
            const user = { fullName, email, password };
            try {
                const res = await axios.post(`${API_END_POINT}/register`, user, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (res.data.success) {
                    toast.success(res.data.message);
                    setIsLogin(true);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
                toast.error(errorMessage);
            }
            finally {
                dispatch(setLoading(false));
            }
        }

        setFullName(""); // Clear the form fields after submission
        setEmail("");
        setPassword("");
    };

    return (
        <div>
            <Header />
            <div className='absolute'>
                <img className='w-[100vw] h-[100vh]' src="https://help.nflxext.com/0af6ce3e-b27a-4722-a5f0-e32af4df3045_what_is_netflix_5_en.png" alt="banner" />
            </div>
            <form onSubmit={getInputData} className='flex flex-col w-3/12 p-12 my-36 left-0 right-0 mx-auto items-center justify-center absolute rounded-md bg-black opacity-90'>
                <h1 className='text-3xl text-white mb-5 font-bold'>{isLogin ? "Login" : "Signup"}</h1>
                <div className="flex flex-col w-full">
                    {!isLogin && (
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            placeholder='Fullname'
                            className='outline-none p-3 m-2 rounded-sm bg-gray-800 text-white w-full'
                        />
                    )}
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder='Email'
                        className='outline-none p-3 m-2 rounded-sm bg-gray-800 text-white w-full'
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder='Password'
                        className='outline-none p-3 m-2 rounded-sm bg-gray-800 text-white w-full'
                    />
                    <button type="submit" className='bg-red-600 mt-6 p-3 text-white rounded-sm font-medium w-full'>
                        {`${isLoading ? "loading..." : (isLogin ? "Login" : "Signup")}`}
                    </button>
                    <p className='text-white mt-2'>
                        {isLogin ? "New to TTStream?" : "Already have an account?"}
                        <span onClick={loginHandler} className='ml-1 text-blue-800 font-medium cursor-pointer'>
                            {isLogin ? "Signup" : "Login"}
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
