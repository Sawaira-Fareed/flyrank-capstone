export default async function HealthPage() {
  let status = "Checking...";
  let timestamp = "";
  try {
    const res = await fetch("https://api.github.com/zen", { next: { revalidate: 0 } });
    status = res.ok ? "API reachable" : "API error";
    timestamp = new Date().toISOString();
  } catch {
    status = "Network error";
    timestamp = new Date().toISOString();
  }
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Health Check</h1>
      <p className="mt-2 text-lg">{status}</p>
      <p className="text-sm text-gray-500 mt-1">Checked: {timestamp}</p>
    </main>
  );
}