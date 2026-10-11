export async function call(url: string, method: string, data?: unknown) {
  try {
    const r = await fetch(url, {
      method, headers: { "Content-Type": "application/json" },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
    return (await r.json()) as { ok: boolean; data?: any; error?: string };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
