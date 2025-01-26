import "../globals.css";
import { LandingHeader } from "@/components/layout/headers/landing-header";
import { BaseLayout } from "@/components/layout/base-layout";

export { metadata } from "@/components/seo/metadata"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout Header={LandingHeader}>
      {children}
    </BaseLayout>
  );
}
