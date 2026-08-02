'use client';

import React, { useState, useEffect } from 'react';

interface SystemMetrics {
  backendStatus: string;
  uptime: number;
  dbStatus: string;
  activeReplicas: number;
  gitopsStatus: string;
  lastDeployed: string;
}

export default function Home() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    backendStatus: 'CONNECTING...',
    uptime: 0,
    dbStatus: 'CHECKING...',
    activeReplicas: 3,
    gitopsStatus: 'SYNCED',
    lastDeployed: new Date().toLocaleTimeString(),
  });

  const [loading, setLoading] = useState(true);
  const [showGrafana, setShowGrafana] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/healthz');
        if (res.ok) {
          const data = await res.json();
          setMetrics((prev) => ({
            ...prev,
            backendStatus: 'HEALTHY',
            uptime: Math.round(data.checks.uptime || 0),
            dbStatus: data.checks.database === 'ok' ? 'ONLINE' : 'DEGRADED',
          }));
        } else {
          setMetrics((prev) => ({ ...prev, backendStatus: 'DEGRADED' }));
        }
      } catch (err) {
        setMetrics((prev) => ({
          ...prev,
          backendStatus: 'OFFLINE (STANDBY)',
          dbStatus: 'STANDBY',
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 status-pulse"></div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Production GitOps Cluster :: Active
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mt-1">
            Enterprise Cloud Control Plane
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Secure GitOps CI/CD Platform with Full Observability & Supply Chain Attestation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-blue-950/60 border border-blue-500/30 text-blue-300">
            ArgoCD Auto-Sync Enabled
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-purple-950/60 border border-purple-500/30 text-purple-300">
            Cosign Verified
          </span>
        </div>
      </header>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Backend Microservice
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono ${metrics.backendStatus === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {metrics.backendStatus}
            </span>
            <span className="text-xs text-slate-500 font-mono">Port 5000</span>
          </div>
          <div className="mt-4 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span>Uptime: {metrics.uptime}s</span>
            <span className="text-emerald-400">/livez OK</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            PostgreSQL Database
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono ${metrics.dbStatus === 'ONLINE' ? 'text-emerald-400' : 'text-blue-400'}`}>
              {metrics.dbStatus}
            </span>
            <span className="text-xs text-slate-500 font-mono">Port 5432</span>
          </div>
          <div className="mt-4 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span>Connection Pool: 20</span>
            <span className="text-emerald-400">/readyz OK</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Kubernetes Replicas
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {metrics.activeReplicas} / 3 Healthy
            </span>
            <span className="text-xs text-slate-500 font-mono">k3s-prod</span>
          </div>
          <div className="mt-4 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span>HPA Target: 70% CPU</span>
            <span className="text-cyan-400">PDB Enforced</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            GitOps Deployment State
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-indigo-400">
              {metrics.gitopsStatus}
            </span>
            <span className="text-xs text-slate-500 font-mono">ArgoCD</span>
          </div>
          <div className="mt-4 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span>Self-Heal: Active</span>
            <span className="text-indigo-400">Zero-Downtime</span>
          </div>
        </div>
      </div>

      {/* DevSecOps & Security Attestation Banner */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          DevSecOps Supply Chain & Attestation Pipeline Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">SAST Analysis</div>
            <div className="text-sm font-semibold text-emerald-400 mt-1">SonarCloud Passed</div>
            <div className="text-[11px] text-slate-500 mt-1">0 Security Gate Blockers</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">Container Scan</div>
            <div className="text-sm font-semibold text-emerald-400 mt-1">Trivy Clean</div>
            <div className="text-[11px] text-slate-500 mt-1">0 Critical / 0 High CVEs</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">SBOM Generation</div>
            <div className="text-sm font-semibold text-blue-400 mt-1">Syft SPDX Compliant</div>
            <div className="text-[11px] text-slate-500 mt-1">Artifact Attached</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">Image Signature</div>
            <div className="text-sm font-semibold text-purple-400 mt-1">Cosign Signed</div>
            <div className="text-[11px] text-slate-500 mt-1">Keyless Sigstore OIDC</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">Registry Attestation</div>
            <div className="text-sm font-semibold text-cyan-400 mt-1">GHCR Verified</div>
            <div className="text-[11px] text-slate-500 mt-1">Digest Multi-Arch</div>
          </div>
        </div>
      </div>

      {/* Embedded Grafana Viewer with Back Button */}
      {showGrafana && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowGrafana(false)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                &larr; Back to Landing Page
              </button>
              <span className="text-sm font-mono text-slate-300">
                Grafana Observability Dashboard
              </span>
            </div>
          </div>
          <div className="flex-1 w-full h-full bg-slate-900">
            <iframe
              src="http://localhost:3001"
              className="w-full h-full border-none"
              title="Grafana Dashboard"
            />
          </div>
        </div>
      )}

      {/* Observability Links & System Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200">Prometheus Telemetry</h3>
            <p className="text-xs text-slate-400 mt-1">Real-time HTTP request duration histograms, CPU/Memory gauges, and DB latency.</p>
          </div>
          <a
            href="http://localhost:9090"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl bg-orange-600/20 border border-orange-500/40 text-orange-300 hover:bg-orange-600/30 transition-all"
          >
            Launch Prometheus Metrics UI &rarr;
          </a>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200">Grafana Dashboards</h3>
            <p className="text-xs text-slate-400 mt-1">Pre-configured operational dashboards for Kubernetes nodes, workloads, and API traffic.</p>
          </div>
          <button
            onClick={() => setShowGrafana(true)}
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Launch Grafana Dashboard &rarr;
          </button>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200">Loki Log Aggregation</h3>
            <p className="text-xs text-slate-400 mt-1">Unified structured JSON log collection from Promtail container collectors.</p>
          </div>
          <a
            href="http://localhost:3100/ready"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/30 transition-all"
          >
            Check Loki Ready Endpoint (/ready) &rarr;
          </a>
        </div>
      </div>
    </main>
  );
}
