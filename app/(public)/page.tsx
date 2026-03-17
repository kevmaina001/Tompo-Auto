import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: {
    absolute: "Tompo's Auto Spare Parts | Quality Auto Parts in Kenya",
  },
  description: "Kenya's trusted supplier of genuine auto spare parts. Quality engine parts, brake systems, suspension, electrical components for all vehicle makes. Fast delivery in Nairobi & nationwide.",
  alternates: {
    canonical: "https://www.tomposauto.com",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
