import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, fireDB } from '../fireBaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Layout from '../component/Layout';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Timestamp, collection, addDoc, getDocs, where, query } from 'firebase/firestore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const navigate = useNavigate();

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const currentUser = auth.currentUser;
            localStorage.setItem('user', JSON.stringify({ id: currentUser.uid, ...currentUser }));

            console.log(currentUser)
            setEmail('');
            setPassword('');
            window.location.href = './'; // Redirect to home page
        } catch (error) {
            console.error(error);
            alert("Login failed. Please check your email and password.");
        }
    };

    const handleForgotPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email, { url: 'https://bulliontradersfirm.firebaseapp.com/reset-password' });
            alert("Password reset email sent. Check your inbox.");
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/invalid-continue-uri') {
                alert("Invalid continue URL. Please contact support.");
            } else {
                alert("Failed to send password reset email.");
            }
        }
    };
    
    
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Check if the user already exists in Firestore
            const existingUserQuery = query(collection(fireDB, 'users'), where('email', '==', result.user.email));
            const existingUserSnapshot = await getDocs(existingUserQuery);

            // If user already exists, do not add to Firestore
            if (!existingUserSnapshot.empty) {
                localStorage.setItem('user', JSON.stringify({ id: result.user.uid, ...result.user }));
                // Redirect to home page after successful sign-in
                window.location.href = './';
                return; // Exit function to prevent further execution
            }

            // Save user details to Firestore using the UID from Firebase Authentication
            const userData = {
                name: result.user.displayName,
                email: result.user.email,
                time: Timestamp.now(),
                kyc: 'pending'
            };
            const userRef = collection(fireDB, "users");
            await addDoc(userRef, { id: result.user.uid, ...userData });
            localStorage.setItem('user', JSON.stringify({ id: result.user.uid, ...result.user }));
            // Redirect to home page after successful sign-in
            window.location.href = './';
        } catch (error) {
            console.error(error);
            alert("Google login failed. Please try again later.");
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='bg-gray-800 px-10 py-16 rounded-xl w-full max-w-md'>
                <h1 className='text-center text-white text-xl mb-6 font-bold'>Login</h1>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name='email'
                    className='bg-gray-600 mb-6 px-4 py-3 w-full rounded-lg text-black placeholder-text-gray-200 outline-none'
                    placeholder='Email'
                    style={{ backgroundColor: '#e2e0dc' }}
                />
                {!isForgotPassword && (
                    <div className='relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    login();
                                }
                            }}
                            className='bg-gray-600 mb-6 px-4 py-3 w-full rounded-lg text-black placeholder-text-gray-200 outline-none pr-10'
                            placeholder='Password'
                            style={{ backgroundColor: '#e2e0dc' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute inset-y-0 right-0 px-4 text-black rounded-r-lg focus:outline-none flex items-center justify-center'
                            style={{ marginBottom: '15px' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                )}
                {isForgotPassword ? (
                    <>
                        <div className='flex justify-center mb-6'>
                            <button
                                onClick={handleForgotPassword}
                                className='bg-black w-full text-green-500 font-bold px-4 py-3 rounded-lg'>
                                Reset Password
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='flex justify-center mb-6'>
                            <button
                                onClick={login}
                                className='bg-black w-full text-white font-bold px-4 py-3 rounded-lg'>
                                Login
                            </button>
                        </div>
                        <div>
                            <h2
                                className=' text-center text-lg cursor-pointer text-red-500'
                                onClick={() => setIsForgotPassword(true)}
                            >
                                Forgot Password?
                            </h2>
                        </div>
                    </>
                )}
                <div>
                    <h2 className='text-white text-center text-lg'>
                        Don't have an account yet?
                        <Link
                            className='text-white font-bold px-1'
                            to={'/signup'}
                            style={{ transition: 'transform 0.3s ease-in-out', display: 'inline-block' }}
                            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.15)'; }}
                            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                        >
                            Signup
                        </Link>
                    </h2>
                </div>
                <div className='flex justify-center mt-4'>
                    <button
                        onClick={loginWithGoogle}
                        className='bg-blue-600 w-full text-white font-bold px-4 py-3 rounded-lg'
                    >
                        Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
