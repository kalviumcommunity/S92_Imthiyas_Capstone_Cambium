import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institutional SSO",
  description:
    "Access the federated SAML 2.0 and InCommon authentication gateway for university faculty, campus researchers, and institutional research library access.",
  alternates: {
    canonical: "/institution-sso",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
