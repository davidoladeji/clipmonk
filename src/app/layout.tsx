import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipMonk — AI Video Clipping & Social Media Management",
  description:
    "Open source AI-powered platform to clip viral moments from long videos, auto-caption, face-track, and publish to every social platform.",
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
