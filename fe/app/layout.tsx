import type {Metadata} from "next";
import "./globals.css";

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
            lang="vi"
            className="h-full antialiased"
            suppressHydrationWarning
        >
        <body className="min-h-full flex flex-col font-vietnam text-text-dark bg-white overflow-x-hidden">
            {children}
        </body>
        </html>
    );
}
