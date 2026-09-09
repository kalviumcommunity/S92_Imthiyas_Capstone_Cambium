import Link from "next/link";
import { Sparkles, Database, ShieldCheck, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">
                Cambium Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              An AI-powered discovery platform unifying global research grants, Calls for Papers (CFPs), high-impact journals, and collaborative publications onto a single PostgreSQL + pgvector system of record.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-blue-400">
                <Database className="w-3 h-3" /> PostgreSQL 3NF
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">
                <Cpu className="w-3 h-3" /> NestJS Engine
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-purple-400">
                <ShieldCheck className="w-3 h-3" /> REST + OpenAPI
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/opportunities" className="hover:text-blue-400 transition-colors">
                  Opportunity Explorer
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-blue-400 transition-colors">
                  Researcher Bookmarks
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-blue-400 transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* System Contract */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Developer APIs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Interactive Swagger UI
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5000/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  System Health Check
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5000/api/research-opportunities"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Public REST JSON Endpoint
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Cambium Platform. Capstone Project — Kalvium Community.</p>
          <p>Author: Shaik Mohamed Imthiyas T</p>
        </div>
      </div>
    </footer>
  );
}
