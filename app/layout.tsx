import '../styles/globals.css';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html>
      <head />
      <body className="bg-gray-100 p-4 max-w-xl m-auto">{children}</body>
    </html>
  );
}
