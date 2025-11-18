// This root layout is intentionally minimal because the actual layout
// is handled by app/[locale]/layout.tsx for internationalization
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

