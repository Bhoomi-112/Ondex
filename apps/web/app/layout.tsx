export const metadata = {
  title: "Ondex",
  description: "Decentralized dispute resolution on Stellar",
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
