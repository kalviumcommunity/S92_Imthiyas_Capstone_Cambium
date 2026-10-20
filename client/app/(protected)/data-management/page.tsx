"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Database,
  CloudLightning,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  FileCode,
  Tag,
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
  Link2,
  FolderSync,
  Info,
  Server,
  Key,
} from "lucide-react";

interface RegisteredDataset {
  id: string;
  doi: string;
  title: string;
  repository: "Zenodo" | "Dryad" | "Figshare" | "HuggingFace Hub" | "AWS S3 Open Data";
  size: string;
  license: "CC-BY-4.0" | "CC0-1.0" | "ODC-By-1.0" | "Apache-2.0";
  fairScore: { total: number; f: number; a: number; i: number; r: number };
  ontologies: string[];
  coarStatus: "Synchronized" | "Validating Checksum" | "Linked";
  lastPolled: string;
}

const REGISTERED_DATASETS: RegisteredDataset[] = [
  {
    id: "ds-1",
    doi: "10.5281/zenodo.10492810",
    title: "High-Throughput Cryo-EM Tomograms of Neuro-Symbolic Ribosomal Complexes",
    repository: "Zenodo",
    size: "42.8 GB (1,480 raw MRC files)",
    license: "CC-BY-4.0",
    fairScore: { total: 96, f: 25, a: 24, i: 23, r: 24 },
    ontologies: ["GO:0005840 (Ribosome)", "MeSH:D003453 (Cryoelectron Microscopy)"],
    coarStatus: "Synchronized",
    lastPolled: "14 mins ago",
  },
  {
    id: "ds-2",
    doi: "10.5061/dryad.x3ffbg7px",
    title: "Synthesizable Small-Molecule Binding Affinities on Enamine REAL Diversity Library",
    repository: "Dryad",
    size: "3.2 GB (140,000 SDF records)",
    license: "CC0-1.0",
    fairScore: { total: 98, f: 25, a: 25, i: 24, r: 24 },
    ontologies: ["ChEMBL:CHEMBL25 (Target)", "MeSH:D020168 (Chemical Library)"],
    coarStatus: "Synchronized",
    lastPolled: "1 hour ago",
  },
  {
    id: "ds-3",
    doi: "10.6084/m9.figshare.2491028",
    title: "Long-Read Single-Nucleotide Variant Phasing in Pediatric Rare Encephalopathy",
    repository: "Figshare",
    size: "89.4 GB (BAM & VCF callsets)",
    license: "CC-BY-4.0",
    fairScore: { total: 92, f: 24, a: 23, i: 22, r: 23 },
    ontologies: ["HPO:HP:0001298 (Encephalopathy)", "Uberon:UBERON:0000955 (Brain)"],
    coarStatus: "Validating Checksum",
    lastPolled: "3 hours ago",
  },
];

export default function FairDataManagementPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "coar-ingest" | "schema">("catalog");
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string>("Zenodo");
  const [datasetLicense, setDatasetLicense] = useState<string>("CC-BY-4.0");
  const [isLinking, setIsLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  const handleLinkRepository = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl) return;
    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      setLinkSuccess(true);
      setTimeout(() => setLinkSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] font-sans p-6 sm:p-10 selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DCCB] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-3">
              <Database size={13} className="text-[#3E6248]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Research Data Management // FAIR & COAR Notify
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] tracking-tight m-0">
              FAIR Data Ingestion & Repository Bridge
            </h1>
            <p className="font-serif text-base text-[#62685E] mt-2 max-w-2xl leading-relaxed">
              Connect external data repositories without uploading raw petabytes. Ingest metadata via the COAR Notify protocol, map controlled biological ontologies, and enforce Open Access standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("coar-ingest")}
              className="px-4 py-2.5 rounded-full bg-[#3E6248] hover:bg-[#173F35] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Link2 size={13} />
              Bridge Remote Dataset
            </button>
          </div>
        </div>

        {/* Global FAIR Compliance Banner */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#DCE6D7] border border-[#66866A]/40 flex flex-col items-center justify-center shrink-0">
              <span className="font-serif text-2xl font-semibold text-[#173F35]">96</span>
              <span className="text-[9px] font-mono uppercase text-[#3E6248]">/ 100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                  Institutional FAIR Maturity Index
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#DCE6D7]/80 text-[#3E6248] font-mono text-[10px] font-semibold">
                  Gold Standard
                </span>
              </div>
              <p className="text-xs text-[#62685E] mt-1 max-w-xl">
                All 3 registered datasets fulfill machine-actionable metadata, DOI persistence, and Dublin Core serialization requirements.
              </p>
            </div>
          </div>

          {/* FAIR Breakdown Badges */}
          <div className="grid grid-cols-4 gap-3 text-center shrink-0">
            <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]/80 min-w-[70px]">
              <div className="text-[10px] font-mono text-[#62685E]">Findable</div>
              <div className="font-serif text-base font-semibold text-[#3E6248] mt-0.5">25 / 25</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]/80 min-w-[70px]">
              <div className="text-[10px] font-mono text-[#62685E]">Accessible</div>
              <div className="font-serif text-base font-semibold text-[#3E6248] mt-0.5">24 / 25</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]/80 min-w-[70px]">
              <div className="text-[10px] font-mono text-[#62685E]">Interoperable</div>
              <div className="font-serif text-base font-semibold text-[#3E6248] mt-0.5">23 / 25</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]/80 min-w-[70px]">
              <div className="text-[10px] font-mono text-[#62685E]">Reusable</div>
              <div className="font-serif text-base font-semibold text-[#3E6248] mt-0.5">24 / 25</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-[#E4DCCB] pb-1">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "catalog"
                ? "border-[#3E6248] text-[#3E6248]"
                : "border-transparent text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <Database size={14} />
            Registered Datasets ({REGISTERED_DATASETS.length})
          </button>
          <button
            onClick={() => setActiveTab("coar-ingest")}
            className={`px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "coar-ingest"
                ? "border-[#3E6248] text-[#3E6248]"
                : "border-transparent text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <CloudLightning size={14} />
            COAR Notify Ingestion Linker
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "schema"
                ? "border-[#3E6248] text-[#3E6248]"
                : "border-transparent text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <FileCode size={14} />
            JSON-LD & Schema.org Export
          </button>
        </div>

        {/* Tab 1: Dataset Catalog */}
        {activeTab === "catalog" && (
          <div className="space-y-4">
            {REGISTERED_DATASETS.map((ds) => (
              <div
                key={ds.id}
                className="p-6 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#3E6248]/40 transition-all shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DCE6D7] text-[#3E6248] text-[10px] font-mono font-semibold">
                        {ds.repository}
                      </span>
                      <span className="text-xs font-mono text-[#62685E]">{ds.doi}</span>
                      <span className="text-xs font-mono text-[#62685E]">· {ds.license}</span>
                    </div>
                    <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                      {ds.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] font-mono text-xs text-[#202920]">
                      {ds.size}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/20 font-mono text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> {ds.coarStatus}
                    </span>
                  </div>
                </div>

                {/* Ontologies & FAIR Score Bar */}
                <div className="pt-3 border-t border-[#E4DCCB] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-[#62685E]">Ontology Tags:</span>
                    {ds.ontologies.map((ont, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#E4DCCB] text-[10px] font-mono text-[#202920]"
                      >
                        {ont}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#62685E]">
                    <span>Polled: {ds.lastPolled}</span>
                    <button className="text-[#3E6248] hover:underline flex items-center gap-1 font-semibold cursor-pointer">
                      Inspect Manifest <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: COAR Notify Ingestion */}
        {activeTab === "coar-ingest" && (
          <div className="max-w-2xl bg-white p-8 rounded-2xl border border-[#E4DCCB] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-normal text-[#202920] m-0">
                Bridge External Repository (COAR Notify v1.2)
              </h2>
              <p className="text-xs text-[#62685E] mt-1 leading-relaxed">
                Provide a content-addressed identifier (DOI, Zenodo Record URL, Hugging Face Dataset Hub, or S3 URI). Cambium will ping the repository inbox via COAR Notify to subscribe to version updates.
              </p>
            </div>

            <form onSubmit={handleLinkRepository} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#62685E] font-semibold mb-2">
                  Repository Origin
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Zenodo", "Dryad", "Figshare", "HuggingFace Hub", "AWS S3 Open Data"].map(
                    (repo) => (
                      <button
                        type="button"
                        key={repo}
                        onClick={() => setSelectedRepo(repo)}
                        className={`p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                          selectedRepo === repo
                            ? "bg-[#3E6248] text-white border-[#3E6248] font-semibold"
                            : "bg-[#FAF7F0] text-[#62685E] border-[#E4DCCB] hover:text-[#202920]"
                        }`}
                      >
                        {repo}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#62685E] font-semibold mb-2">
                  Content-Addressed URI / Persistent Identifier
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://zenodo.org/records/10892019 or doi:10.5281/zenodo.10892019"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] text-xs font-mono text-[#202920] focus:outline-none focus:border-[#3E6248]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#62685E] font-semibold mb-2">
                  Open Data License
                </label>
                <select
                  value={datasetLicense}
                  onChange={(e) => setDatasetLicense(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] text-xs font-mono text-[#202920] focus:outline-none focus:border-[#3E6248]"
                >
                  <option value="CC-BY-4.0">Creative Commons Attribution 4.0 International (CC-BY-4.0)</option>
                  <option value="CC0-1.0">Public Domain Dedication (CC0 1.0)</option>
                  <option value="ODC-By-1.0">Open Data Commons Attribution (ODC-By)</option>
                  <option value="Apache-2.0">Apache Software License 2.0</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLinking}
                className="w-full py-3 rounded-xl bg-[#3E6248] hover:bg-[#173F35] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <CloudLightning size={14} />
                {isLinking ? "Dispatching COAR Notify Handshake..." : "Initiate Repository Ingestion"}
              </button>

              {linkSuccess && (
                <div className="p-3 rounded-xl bg-[#DCE6D7] text-[#173F35] border border-[#66866A]/30 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  Handshake confirmed! Metadata ingested and indexed in FAIR schema.
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab 3: JSON-LD Schema */}
        {activeTab === "schema" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                  Schema.org / Dataset JSON-LD Serialization
                </h3>
                <p className="text-xs text-[#62685E] mt-0.5">
                  Machine-actionable Dublin Core and W3C DCAT metadata formatted for Google Dataset Search and CrossRef indexers.
                </p>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-xs font-mono text-[#202920] flex items-center gap-1.5 transition-colors cursor-pointer">
                <Download size={13} />
                Download JSON-LD
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#202920] text-[#DCE6D7] font-mono text-xs overflow-x-auto leading-relaxed border border-[#E4DCCB]">
{`{
  "@context": "https://schema.org/",
  "@type": "Dataset",
  "name": "High-Throughput Cryo-EM Tomograms of Neuro-Symbolic Ribosomal Complexes",
  "description": "Standardized tomographic tilt series with machine-verified Horn-clause spatial bounding.",
  "identifier": "https://doi.org/10.5281/zenodo.10492810",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "creator": {
    "@type": "Person",
    "name": "Imthiyas",
    "sameAs": "https://orcid.org/0009-0004-9812-4112",
    "affiliation": "MIT CSAIL"
  },
  "distribution": [
    {
      "@type": "DataDownload",
      "encodingFormat": "application/x-mrc",
      "contentUrl": "https://zenodo.org/records/10492810/files/cryo_em_stack.tar.gz"
    }
  ],
  "keywords": [
    "http://purl.obolibrary.org/obo/GO_0005840",
    "http://id.nlm.nih.gov/mesh/D003453"
  ]
}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
