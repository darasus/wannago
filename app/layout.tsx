import '../styles/globals.css';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html>
      <head />
      <body className="p-4">{children}</body>
    </html>
  );
}
