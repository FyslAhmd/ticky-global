import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function Register() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);

  const register = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate("/");
    },
    onError: (e) => setError(e.message || "Registration failed — please try again."),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    register.mutate({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-sm rounded-2xl border-slate-800 bg-slate-900 text-white">
        <CardHeader className="items-center text-center">
          <Link to="/">
            <img
              src="/images/logo-full-white.png"
              alt="Ticky Global"
              className="mb-2 h-12 w-auto"
            />
          </Link>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <p className="text-sm text-slate-400">
            Register to access Ticky Global services and your future client portal.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="name" className="text-slate-300">
                Full name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Jane Smith"
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="confirm" className="text-slate-300">
                Confirm password
              </Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              disabled={register.isPending}
              className="w-full rounded-full bg-blue-600 font-semibold hover:bg-blue-500"
              size="lg"
            >
              {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-blue-400 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
