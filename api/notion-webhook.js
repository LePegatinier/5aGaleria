export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const expectedSecret = process.env.NOTION_WEBHOOK_SECRET;
  const receivedSecret =
    req.headers["x-webhook-secret"] ||
    req.headers["x-notion-webhook-secret"];

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ ok: false, error: "GITHUB_TOKEN is not configured" });
  }

  try {
    const response = await fetch(
      "https://api.github.com/repos/LePegatinier/5aGaleria/dispatches",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: "notion-publish",
          client_payload: {
            source: "notion-webhook",
            received_at: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      return res.status(502).json({
        ok: false,
        error: "GitHub dispatch failed",
        detail,
      });
    }

    return res.status(200).json({ ok: true, dispatched: "notion-publish" });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Webhook processing failed",
    });
  }
}
