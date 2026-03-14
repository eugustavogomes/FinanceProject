import type { ReactNode } from 'react';
import LightRays from '../LightRays';

const LIGHT_RAYS_PROPS = {
  raysOrigin: 'top-center' as const,
  raysColor: '#22c55e',
  raysSpeed: 1,
  lightSpread: 1.2,
  rayLength: 2.5,
  pulsating: true,
  fadeDistance: 1.0,
  followMouse: true,
  mouseInfluence: 0.15,
};

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Shared layout for auth pages (Login, Register, ForgotPassword).
 * Provides consistent background, LightRays, and card wrapper.
 */
export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="login-page-bg min-h-screen flex items-center justify-center relative bg-gray-950">
      <div className="absolute inset-0 z-0">
        <LightRays {...LIGHT_RAYS_PROPS} />
      </div>
      <div className="w-full max-w-[430px] mx-auto rounded-xl shadow-3xl border border-white/20 py-8 relative z-10 bg-white/10 backdrop-blur-8xl px-4">
        <div className="flex flex-col items-center justify-center mb-1">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="text-center mt-1 text-xs text-white">{footer}</div>}
      </div>
    </main>
  );
}
