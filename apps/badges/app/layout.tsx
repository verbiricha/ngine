export const metadata = {
  metadataBase: new URL('https://badges.page'),
  title: "Badges",
  description: "Create, collect and award badges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
