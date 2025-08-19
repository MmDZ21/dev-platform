import localFont from "next/font/local";

export const iranSans = localFont({
  src: [
    { path: "../../public/fonts/IranSansRegular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/IranSansBold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-iran-sans",
  display: "swap",
});


