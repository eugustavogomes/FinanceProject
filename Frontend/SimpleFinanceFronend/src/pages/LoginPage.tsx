import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LightRays from '../components/LightRays';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError("Preencha ambos os campos");
      return;
    }

    try {
      login("demo-token");
      navigate("/dashboard");
    } catch {
      setError("Credenciais inválidas");
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
      <div className="card w-full max-w-[400px] mx-auto rounded-xl shadow-lg border border-gray-700 py-6 relative z-10 bg-transparent">
        <form
          className="card-body flex flex-col gap-7 p-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex justify-center mb-4">
            <h2 className="text-2xl font-bold text-green-700">
              Finance Dashboard Login
            </h2>
          </div>

          {error && (
            <div className="alert alert-danger text-red-600 bg-red-100 p-2 text-center rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              autoComplete="off"
              className="input px-3 py-2 border rounded focus:outline-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              autoComplete="off"
              className="input px-3 py-2 border rounded focus:outline-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-row items-center justify-between mt-1 mb-2 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="checkbox" />
              <span>Lembrar-me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary p-2 font-semibold flex justify-center bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-md"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
