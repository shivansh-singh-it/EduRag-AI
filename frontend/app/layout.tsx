import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "EduRAG AI — Personalized Learning Powered by Student Analytics + Context-Aware RAG",
  description: "An AI-powered personalized educational platform inspired by PRAG-EDU and adapted to the Open University Learning Analytics Dataset (OULAD).",
  keywords: ["AI Education", "RAG", "OULAD", "Learning Analytics", "Personalized Learning", "PRAG-EDU", "LLM Adaptation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
