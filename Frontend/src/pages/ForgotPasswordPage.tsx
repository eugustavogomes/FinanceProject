import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { AuthMessage } from "../components/auth/AuthMessage";
import { MdEmail } from "react-icons/md";
import { forgotPassword } from '../hooks/useForgotPassword';

const inputClass = "w-full bg-transparent text-white placeholder-white pl-10 py-2 border-0 border-b-2 border-b-gray-400 focus:border-b-blue-400 focus:ring-0 transition outline-none";

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
      await forgotPassword({ email });
      setSuccess("Password reset link sent! Check your email.");
      setEmail("");
    } catch (err: any) {
      setError(err?.response?.data || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
      footer={
        <>Remember your password? <Link to="/login" className="text-blue-200 hover:underline">Login</Link></>
      }
    >
      <form className="card-body flex flex-col gap-7 p-4" onSubmit={handleSubmit} noValidate>
        <AuthMessage variant="error">{error}</AuthMessage>
        <AuthMessage variant="success">{success}</AuthMessage>

        <div className="flex flex-col gap-2 px-2">
          <div className="relative">
            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input type="email" placeholder="Email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          </div>
        </div>

        <button type="submit" className="p-2 font-semibold flex justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </AuthLayout>
  );
}