import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export const metadata: Metadata = {
	title: "OK-TRAIN 電光掲示板",
	description: "調布駅のリアルタイム電光掲示板（非公式）",
	keywords: ["OK-TRAIN", "電光掲示板", "調布駅"],
	openGraph: {
		title: "OK-TRAIN 電光掲示板",
		description: "Welcome to the 電光掲示板!",
		url: `${NEXT_PUBLIC_BASE_URL}/`,
		siteName: "OK-TRAIN 電光掲示板",
		images: [
			{
				url: `${NEXT_PUBLIC_BASE_URL}/images/ogp.webp`,
				width: 1200,
				height: 630,
				alt: "OK-TRAIN 電光掲示板 OGP",
			},
		],
		locale: "ja_JP",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "OK-TRAIN 電光掲示板",
		description: "Welcome to the 電光掲示板!",
		images: [`${NEXT_PUBLIC_BASE_URL}/images/ogp.webp`],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const gaId = process.env.NEXT_PUBLIC_GTAG;
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
			{gaId && <GoogleAnalytics gaId={gaId} />}
		</html>
	);
}
