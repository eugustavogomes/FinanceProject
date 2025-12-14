import { useState } from "react";
import { Link } from "react-router-dom";
import LightRays from '../components/LightRays';
import { MdEmail } from "react-icons/md";
import axios from "axios";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email) {
            setError("Please enter your email");
            return;
        }

        try {
            setError("");
            setSuccess("");
            setIsLoading(true);
            await axios.post("http://localhost:5000/api/auth/forgot-password", {
                email
            });
            setSuccess("Password reset link sent! Check your email.");
            setEmail("");
        } catch (err: any) {
            setError(err?.response?.data || "Failed to send reset link");
        } finally {
            setIsLoading(false);
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
                            Forgot Password
                        </h2>
                        <p className="text-white text-xs text-center mt-2">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
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
                            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-transparent text-white placeholder-white pl-10 py-2 border-0 border-b-2 border-b-gray-400 focus:border-b-blue-400 focus:ring-0 transition outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary p-2 font-semibold flex justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                <p className="text-white text-center mt-1 text-xs">
                    Remember your password? <Link to="/login" className="text-blue-200 hover:underline">Login</Link>
                </p>
            </div>
        </main>
    );
}