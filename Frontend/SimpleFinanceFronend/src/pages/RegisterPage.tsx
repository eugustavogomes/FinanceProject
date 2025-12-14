import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LightRays from '../components/LightRays';
import { MdEmail } from "react-icons/md";
import { FaLock, FaUser } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setError("");
            setSuccess("");
            await axios.post("http://localhost:5000/api/auth/register", {
                name,
                email,
                password
            });
            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
            setError(err?.response?.data || "Registration failed");
        }
    }

    return (
        <main className="login-page-bg min-h-screen flex items-center justify-center relative bg-gray-950">
            <div className="absolute inset-0 z-0">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#22c55e"
                    raysSpeed={1}
                    lightSpread={1.2}
                    rayLength={2.5}
                    pulsating={true}
                    fadeDistance={1.0}
                    followMouse={true}
                    mouseInfluence={0.15}
                />
            </div>
            <div className="card w-full max-w-[430px] mx-auto rounded-xl shadow-3xl border border-white/20 py-8 relative z-10 
    bg-white/10 backdrop-blur-8xl px-4">
                <form
                    className="card-body flex flex-col gap-7 p-4"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="flex flex-col items-center justify-center mb-1">
                        <h2 className="text-2xl font-bold text-white">
                            Create Account
                        </h2>
                        <p className="text-white text-xs">Sign up to start managing your finances.</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger text-red-600 bg-red-100 p-2 text-center rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success text-green-600 bg-green-100 p-2 text-center rounded">
                            {success}
                        </div>
                    )}

                    <div className="flex flex-col gap-2 px-2">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full bg-transparent text-white placeholder-white pl-10 py-2 border-0 border-b-2 border-b-gray-400 focus:border-b-blue-400 focus:ring-0 transition outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-transparent text-white placeholder-white pl-10 py-2 border-0 border-b-2 border-b-gray-400 focus:border-b-blue-400 focus:ring-0 transition outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full bg-transparent text-white placeholder-white pl-10 py-2 border-0 border-b-2 border-b-gray-400 focus:border-b-blue-400 focus:ring-0 transition outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="w-full bg-transparent text-white placeholder-white pl-10 py-2 border-0 border-b-2 border-b-gray-400 focus:border-b-blue-400 focus:ring-0 transition outline-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-start mt-1 mb-2 gap-2 text-xs px-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <span className="relative">
                                <input
                                    type="checkbox"
                                    className="peer appearance-none w-4 h-4 border border-gray-500 rounded bg-transparent checked:bg-blue-600 checked:border-blue-600 transition-all"
                                    id="terms"
                                    required
                                />
                                <FaCheck className="pointer-events-none absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition" />
                            </span>
                            <span className="text-white">I agree to the Terms & Conditions</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary p-2 font-semibold flex justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-white text-center mt-1 text-xs">
                    Already have an account? <Link to="/login" className="text-blue-200 hover:underline">Login</Link>
                </p>
            </div>
        </main>
    );
}
