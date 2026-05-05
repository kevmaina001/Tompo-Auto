import { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Products",
  description:
    "Search Tompo's Auto Spare Parts catalog by product name, brand, OEM number, or compatible vehicle model.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return <SearchClient />;
}
