import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guided Requirements Tool",
  description: "Strukturierte Anforderungserfassung für Product Owner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
