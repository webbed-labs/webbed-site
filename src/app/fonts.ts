import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const satoshi = localFont({
  src: [
    { path: "./fonts/satoshi/Satoshi-Regular.woff2", weight: "400" },
    { path: "./fonts/satoshi/Satoshi-Medium.woff2", weight: "500" },
    { path: "./fonts/satoshi/Satoshi-Bold.woff2", weight: "700" },
  ],
  display: "swap",
  variable: "--font-body",
  fallback: ["system-ui", "Segoe UI", "Arial"],
});

export const satoshiVariable = localFont({
  src: [
    { path: "./fonts/satoshi/Satoshi-Variable.woff2", weight: "300 900" },
    { path: "./fonts/satoshi/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-ui",
  fallback: ["system-ui", "Segoe UI", "Arial"],
});
