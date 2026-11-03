"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log fatal root-level error
    console.error("[Cambium GlobalError caught]", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>System Interruption // Cambium Research Operating System</title>
        <style dangerouslySetInnerHTML={{ __html: `
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background-color: #FAF7F0;
            color: #202920;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 580px;
            width: 100%;
            background: #FFFFFF;
            border: 1px solid #E4DCCB;
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 40px -10px rgba(32, 41, 32, 0.08);
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            background: #DCE6D7;
            border: 1px solid rgba(62, 98, 72, 0.25);
            border-radius: 9999px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #3E6248;
            margin-bottom: 20px;
          }
          .badge-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3E6248;
          }
          h1 {
            font-size: 26px;
            font-weight: 600;
            letter-spacing: -0.02em;
            color: #202920;
            margin-bottom: 12px;
            line-height: 1.25;
          }
          p {
            font-size: 14px;
            color: #62685E;
            line-height: 1.6;
            margin-bottom: 28px;
          }
          .btn-group {
            display: flex;
            flex-direction: row;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #3E6248;
            color: #FAF7F0;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 12px 24px;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            text-decoration: none;
            transition: background 150ms ease;
          }
          .btn-primary:hover {
            background: #293E30;
          }
          .btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #FAF7F0;
            color: #202920;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 12px 24px;
            border-radius: 9999px;
            border: 1px solid #E4DCCB;
            cursor: pointer;
            text-decoration: none;
            transition: all 150ms ease;
          }
          .btn-secondary:hover {
            background: #F2EBDD;
          }
          .footer-note {
            margin-top: 28px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 10px;
            color: #85877B;
            border-top: 1px solid #E4DCCB;
            padding-top: 16px;
          }
        `}} />
      </head>
      <body>
        <div className="container">
          <div className="badge">
            <span className="badge-dot" />
            <span>Root Exception Guard Active</span>
          </div>
          <h1>System Interruption Recovered</h1>
          <p>
            Cambium caught an unexpected runtime fault during page orchestration.
            Your academic notes, active citations, and session ledger remain safe.
          </p>
          <div className="btn-group">
            <button className="btn-primary" onClick={() => reset()}>
              Reload System Node
            </button>
            <a className="btn-secondary" href="/dashboard">
              Return to Dashboard
            </a>
            <a className="btn-secondary" href="/">
              Landing Page
            </a>
          </div>
          <div className="footer-note">
            CAMBIUM RESEARCH // ZERO-DATA-LOSS TELEMETRY // FAULT: RECOVERED
          </div>
        </div>
      </body>
    </html>
  );
}

