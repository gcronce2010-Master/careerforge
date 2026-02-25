import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareerForge AI | Professional Portfolio Builder',
  description: 'AI-powered professional portfolio builder for tech-focused careers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-accent/30">
        {children}
      </body>
    </html>
  );
}
