import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-sm rounded-2xl border-slate-800 bg-slate-900 text-white">
        <CardHeader className="items-center text-center">
          <img
            src="/images/logo-full-white.png"
            alt="Westbridge Global"
            className="mb-2 h-12 w-auto"
          />
          <CardTitle className="text-xl">Team sign-in</CardTitle>
          <p className="text-sm text-slate-400">
            Access the Westbridge Global admin dashboard — enquiries, reviews, pages and analytics.
          </p>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full rounded-full bg-blue-600 font-semibold hover:bg-blue-500"
            size="lg"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            Sign in with Kimi
          </Button>
          <p className="mt-4 text-center text-xs text-slate-500">
            Authorised Westbridge Global staff only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
