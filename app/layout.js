import './globals.css';

export const metadata = {
  title: 'Gurdeep Saini',
  description: 'A polished personal landing page built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
