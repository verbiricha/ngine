export const metadata = {
  metadataBase: new URL("https://emojito.meme"),
  title: "emojito",
  description: "Stir up your reactions with custom emoji",
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
