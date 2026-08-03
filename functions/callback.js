// Cloudflare Pages Function: GET /callback
// Finishes the GitHub OAuth login and hands the access token back to
// the Sveltia CMS window via postMessage.

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookie = request.headers.get("Cookie") || "";
  const savedState = (cookie.match(/(?:^|;\s*)csrf_state=([^;]+)/) || [])[1];

  if (!code) {
    return renderPage("error", { message: "Missing authorization code." });
  }
  if (!state || state !== savedState) {
    return renderPage("error", { message: "Invalid state — the login could not be verified." });
  }

  let data;
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "earth-sanctuary-cms",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    data = await res.json();
  } catch (err) {
    return renderPage("error", { message: "Could not reach GitHub to complete login." });
  }

  if (data.error || !data.access_token) {
    return renderPage("error", {
      message: data.error_description || "GitHub did not return an access token.",
    });
  }

  return renderPage("success", { token: data.access_token, provider: "github" });
}

function renderPage(status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Signing in…</title></head>
  <body>
    <p>Completing sign-in… you can close this window if it does not close automatically.</p>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(${JSON.stringify(message)}, e.origin);
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        // Clear the one-time CSRF cookie.
        document.cookie = "csrf_state=; Path=/; Max-Age=0";
        window.opener && window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

  return new Response(html, {
    status: status === "success" ? 200 : 401,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
