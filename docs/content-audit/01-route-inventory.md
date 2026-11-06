# Cambium Content Audit — Document 01: Route Inventory

This inventory catalogs all 50 compiled routes in the Cambium Research Next.js application, along with their primary content surfaces and user-facing purpose.

| Route | Content Surface | Purpose |
| :--- | :--- | :--- |
| `/` | Landing Page | Primary introduction to Cambium, value proposition, knowledge graph preview, and workflow highlights. |
| `/about` | About Cambium | Product philosophy, institutional context, and architectural principles. |
| `/pricing` | Pricing & Tiers | Transparent breakdown of Individual, Lab, and University subscription plans. |
| `/contact` | Contact Directory | Dedicated communication channels for researchers, laboratories, and institutions. |
| `/careers` | Careers & Contributions | Open engineering and research tracks for prospective contributors. |
| `/changelog` | Release Changelog | Chronological history of platform releases and technical improvements. |
| `/status` | System Status | Real-time status of APIs, database, search cluster, and WebSocket mesh. |
| `/terms` | Terms of Service | Formal legal terms for platform use. |
| `/privacy` | Privacy Policy | Data privacy, telemetry, and GDPR/CCPA compliance statement. |
| `/disclaimer` | Research Disclaimer | Clear notice regarding academic preprint distribution and third-party data sources. |
| `/sign-in` | Authentication | Sign-in interface supporting email/password and university SSO. |
| `/sign-up` | Registration | Account creation for scholars and students. |
| `/forgot-password` | Password Recovery | Password reset request flow. |
| `/reset-password` | Password Reset | Secure password change form with token verification. |
| `/welcome` | Onboarding | Scholar profile setup, topic selection, and ORCID linking. |
| `/dashboard` | Researcher Dashboard | Personalized feed, upcoming deadlines, recommended papers, and quick actions. |
| `/discover` | Literature Discovery | Semantic search across 250M+ OpenAlex & Europe PMC publications. |
| `/opportunities` | Opportunity Finder | Search and filter grants, fellowships, and conference CFPs. |
| `/publications` | Publications Catalog | Indexed papers, author dossiers, and citation counts. |
| `/workspace` | Research Workspaces | Active lab project workspaces, note-taking canvas, and artifact manager. |
| `/workspace/upload` | File Ingestion | Dropzone for ingesting PDF preprints, BibTeX libraries, and dataset metadata. |
| `/portfolio` | Scholar Portfolio | Public research profile, verified contribution heatmap, and CV builder. |
| `/os` | Personal Research OS | Research project pipelines, sprint tracking, and task management. |
| `/intelligence` | Research Intelligence | Semantic topic clusters, cross-domain connections, and field analysis. |
| `/graph` | Citation Knowledge Graph | Interactive 2D relational network of connected publications and authors. |
| `/audit` | Audit Log | Append-only event log tracking authentication, data egress, and workspace permissions. |
| `/compliance` | IRB & Ethics Compliance | Multi-site IRB protocol tracking, consent forms, and ethics approval records. |
| `/peer-review` | Peer Review Workspace | Double-blind manuscript evaluation with 14 CRediT authorship roles. |
| `/lab` | Laboratory Hub | Multi-tenant lab administration, member roster, and shared computing quotas. |
| `/grants` | Grant Management | Pre- and post-award grant tracking, budget monitoring, and milestone reports. |
| `/community` | Scholar Network Feed | Academic discussions, methodology debates, and collaboration announcements. |
| `/messages` | Scholar Messaging | 1-on-1 verified researcher messaging with paper and grant attachments. |
| `/notifications` | Research Inbox | Real-time notification stream for citations, reviews, and deadline reminders. |
| `/profile` | Profile Settings | Academic bio, research interests, laboratory affiliation, and external links. |
| `/settings` | Platform Settings | Account security, API tokens, notification preferences, and AI assistant settings. |
| `/billing` | Subscription & Billing | Active tier management, invoice history, and institutional seat allocation. |
| `/help` | Help & Documentation | User guides, search syntax tips, and troubleshooting articles. |
| `/data-management` | Data Management | Repository sync (Zenodo, Dryad), metadata indexing, and export utilities. |
| `/agent-reader` | Split-Pane Paper Reader | Split-screen PDF reader with AI-assisted citation and methodology lookup. |
| `/institution-sso` | University SSO Portal | InCommon / SAML 2.0 institutional login gateway. |
| `/reader` | Reader View | Focused distraction-free manuscript reading view. |
| `/bookmarks` | Saved Items | Curated reading lists, bookmarked grants, and saved queries. |
| `/403` | Access Restricted | Informative permission boundary explanation with request access flow. |
| `/404` | Page Not Found | Helpful 404 error page with direct navigation back to app. |
| `/429` | Rate Limit Reached | Clear explanation of request rate limits with live cooldown timer. |
| `/error-500` | Server Error | Graceful server error page with recovery instructions. |
| `/_not-found` | Global 404 Handler | Global Next.js fallback 404 handler. |

