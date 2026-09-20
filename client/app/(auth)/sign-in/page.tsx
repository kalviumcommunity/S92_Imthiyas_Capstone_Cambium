"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleIcon, MicrosoftIcon, OrcidIcon } from "@/components/auth/AuthIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError(null);
      const res = await api.post("/auth/google", { token: credentialResponse.credential });
      if (res.data.success) {
        setAuth(res.data.user, res.data.token);
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-heading-1 font-serif text-foreground">
          Sign in to your account
        </h2>
        <p className="text-body-sm text-muted-foreground">
          Welcome back to your research workspace.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-center w-full bg-background rounded-md border border-input h-10 items-center overflow-hidden">
           <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
           />
        </div>
        {[
          { label: "Continue with Microsoft", Icon: MicrosoftIcon },
          { label: "Continue with ORCID", Icon: OrcidIcon },
        ].map(({ label, Icon }) => (
          <Button
            key={label}
            variant="outline"
            className="w-full justify-center gap-2.5 bg-background hover:bg-background-alt text-foreground font-medium h-10"
          >
            <Icon />
            {label}
          </Button>
        ))}
      </div>
      
      {error && (
        <div className="text-red-500 text-sm text-center font-medium">
          {error}
        </div>
      )}

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs px-2 shrink-0 text-muted-foreground bg-background">
          or continue with email
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-foreground hover:text-primary transition-colors underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon size={16} />
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full mt-1">
          Sign in
        </Button>
      </form>

      <div className="flex flex-col gap-2 pt-2">
        <p className="text-xs text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground hover:text-primary transition-colors underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
