// Cloudflare Pages Function: GET /auth
// Kicks off the GitHub OAuth login used by Sveltia CMS at /admin.
// Requires two environment variables set in the Cloudflare Pages project:
//   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response(
      "OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in the Cloudflare Pages project settings.",
      { status: 500, headers: { "Content-Type": "text/plain" } }
    );
  }

  const scope = url.searchParams.get("scope") || "repo,user";
  const state = crypto.randomUUID();
  const redirectUri = `${url.origin}/callback`;

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", scope);
  authorize.searchParams.set("state", state);

  const headers = new Headers({ Location: authorize.toString() });
  headers.append(
    "Set-Cookie",
    `csrf_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  return new Response(null, { status: 302, headers });
}
