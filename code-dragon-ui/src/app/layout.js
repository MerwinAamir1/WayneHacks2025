import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Code Dragon",
  description: "Your coding platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-brandBlack text-brandWhite">
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
