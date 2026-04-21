import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sites Directory",
  description: "Browse HTML files from the sites directory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
