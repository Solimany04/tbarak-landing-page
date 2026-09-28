// The admin UI is mounted by layout.tsx; this catch-all just makes the route
// exist. For `output: 'export'` we emit only the base /keystatic path — deep
// links like /keystatic/collection/products are handled client-side after load,
// and on a hard refresh Cloudflare serves this same shell via public/_redirects.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ params: [] }];
}

export default function Page() {
  return null;
}
