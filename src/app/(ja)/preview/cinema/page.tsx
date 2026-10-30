import type { Metadata } from "next";
import { ExperimentalStudio } from "@/components/experimental/ExperimentalStudio";
export const metadata: Metadata = { title: "CINEMA | THE JEWELRY Creative Study", robots: { index: false, follow: false } };
export default function Page() { return <ExperimentalStudio variant="cinema" />; }
