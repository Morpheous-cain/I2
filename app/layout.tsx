import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImmersiCloud — Build Beyond Reality",
  description:
    "Immersive digital experiences at the intersection of cloud infrastructure and spatial computing.",
  openGraph: {
    title: "ImmersiCloud — Build Beyond Reality",
    description:
      "Immersive digital experiences at the intersection of cloud infrastructure and spatial computing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts loaded via <link> so they work in any environment */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
