import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, fireDB } from '../fireBaseConfig';
import Layout from '../component/Layout';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Timestamp, collection, addDoc,getDoc ,doc ,getDocs , where,query} from 'firebase/firestore'; // Add these imports

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const signup = async () => {
        setLoading(true);
        try {
            if (name === "" || email === "" || password === "") {
                throw new Error("All fields are required");
            }
    
            // Check if the email is already in use
            const existingUserQuery = query(collection(fireDB, 'users'), where('email', '==', email));
            const existingUserSnapshot = await getDocs(existingUserQuery);
    
            if (!existingUserSnapshot.empty) {
                throw new Error("Email is already in use");
            }
    
            const users = await createUserWithEmailAndPassword(auth, email, password);
    
            // Set the display name if available, otherwise use the email
            const displayName = users.user.displayName ? users.user.displayName : name;
    
            localStorage.setItem('user', JSON.stringify({ id: users.user.uid, ...users.user, displayName }));
    
            const user = {
                name: name,
                uid: users.user.uid,
                email: users.user.email,
                time: Timestamp.now(),
                kyc: 'pending'
            };
            const userRef = collection(fireDB, "users");
            await addDoc(userRef, { id: users.user.uid, ...user });
            setLoading(false);
            window.location.href='./'
        } catch (error) {
            console.error(error);
            setLoading(false);
            alert(error.message);
        }
    };
    
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log("Google sign-in successful:", result);
    
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
            console.error("Google sign-in failed:", error);
            alert("Google sign-in failed. Please try again later.");
        }
    };
    

    return (
      
            <div className='flex justify-center items-center h-screen'>
                <div className='bg-gray-800 px-10 py-16 rounded-xl w-full max-w-md'>
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Signup</h1>
                    <input type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name='name'
                        className='bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-black placeholder:text-black-200'
                        placeholder='Name'
                    />
                    <input type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name='email'
                        className='bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-black placeholder:text-black-200'
                        placeholder='Email'
                    />
                    <div className='relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-black placeholder:text-black-200'
                            placeholder='Password'
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute inset-y-0 right-0 px-4  text-black rounded-r-lg focus:outline-none flex items-center justify-center'
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className='flex justify-center mb-3'>
                        <button
                            onClick={signup}
                            className='bg-black w-full text-white font-bold px-2 py-2 rounded-lg'>
                            Signup
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={handleGoogleSignIn}
                            className='bg-black w-full text-white font-bold px-2 py-2 rounded-lg'>
                            Google Signup
                        </button>
                    </div>
                    <div>
                        <h2 className='text-white text-lg'>Already have an account? <Link to={'/login'} className='text-white font-bold px-1'>Login</Link></h2>
                    </div>
                </div>
            </div>
     
    )
}

export default Signup;
