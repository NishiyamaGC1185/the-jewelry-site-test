import type { Metadata } from "next";
import { StudioIndex } from "@/components/experimental/ExperimentalStudio";
export const metadata: Metadata = { title: "Creative Studies | THE JEWELRY", robots: { index: false, follow: false } };
export default function Page() { return <StudioIndex />; }
