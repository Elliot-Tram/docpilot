import { Client } from "@upstash/qstash";

function getClient() {
  return new Client({ token: process.env.QSTASH_TOKEN! });
}

export async function enqueueJob(
  jobName: string,
  payload: Record<string, unknown>
) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  await getClient().publishJSON({
    url: `${baseUrl}/api/jobs/${jobName}`,
    body: payload,
    retries: 3,
  });
}
