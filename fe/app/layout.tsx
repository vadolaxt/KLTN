import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {ENV_CONFIG} from "@/core";
import {Toaster} from "@/components/ui/sonner";
import {Geist, Geist_Mono} from "next/font/google";

const geistSans = Geist({
	variable: "--font-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Tuyển sinh - Trường Đại Học Nông Lâm TP. HCM",
    description: "Hệ thống tuyển sinh trực tuyến - Trường Đại Học Nông Lâm TP. HCM",
};

export default function RootLayout({
												  children,
											  }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
		<body className="min-h-full flex flex-col">
		<GoogleOAuthProvider clientId={ENV_CONFIG.googleClientId}>
			{children}
		</GoogleOAuthProvider>
		<Toaster position="top-center" richColors/>
		</body>
		</html>
	);
}
