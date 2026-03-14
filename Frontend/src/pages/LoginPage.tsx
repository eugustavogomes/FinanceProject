import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import { AuthMessage } from "../components/auth/AuthMessage";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { Eye, EyeClosed } from "lucide-react";
import { loginUser } from '../hooks/useLogin';
import { ToggleCheckbox } from "../components/ui/ToggleCheckbox";

const inputClass = "w-full bg-transparent text-white placeholder-white pl-10 py-2 border-0 border-b-2 border-b-gray-400 focus:border-b-blue-400 focus:ring-0 transition outline-none";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("sf-remembered-identifier");
    if (stored) {
      setIdentifier(stored);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please fill in both fields");
      return;
    }
    try {
      setError("");
      const res = await loginUser({ identifier, password });
      login(res.data.token);
      if (rememberMe) localStorage.setItem("sf-remembered-identifier", identifier);
      else localStorage.removeItem("sf-remembered-identifier");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data || "Login failed");
    }
  }

  return (
    <AuthLayout
      title="Simple Finance Login"
      subtitle="Financial dashboard for managing your personal finances."
      footer={
        <>Don't have an account? <Link to="/register" className="text-blue-200 hover:underline">Sign up</Link></>
      }
    >
      <form className="card-body flex flex-col gap-7 p-4" onSubmit={handleSubmit} noValidate>
        <AuthMessage variant="error">{error}</AuthMessage>

        <div className="flex flex-col gap-2 px-2">
          <div className="relative">
            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Email or Username"
              className={inputClass}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeClosed className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between mt-1 mb-2 gap-2 text-xs px-2">
          <ToggleCheckbox checked={rememberMe} onChange={setRememberMe} label="Remember me" />
          <Link to="/forgot-password" className="text-blue-200 hover:underline">Forgot password?</Link>
        </div>

        <button
          type="submit"
          className="p-2 font-semibold flex justify-center items-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md w-full"
        >
          Login
        </button>
      </form>
    </AuthLayout>
  );
}
