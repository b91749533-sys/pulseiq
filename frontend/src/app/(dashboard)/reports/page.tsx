'use client';

import React, { useState } from 'react';
import {
  useReports,
  useCreateReport,
  useDeleteReport,
} from '@/hooks/useApi';
import {
  FileText,
  Download,
  Plus,
  Trash2,
  Calendar,
  Loader2,
  FileSpreadsheet,
  HelpCircle,
} from 'lucide-react';

export default function ReportsPage() {
  const [reportTitle, setReportTitle] = useState('');
  const [rangeStart, setRangeStart] = useState('2026-07-01');
  const [rangeEnd, setRangeEnd] = useState('2026-07-12');
  const [format, setFormat] = useState('CSV');

  const { data: reports, isLoading: listLoading } = useReports();
  const { mutateAsync: createReport, isPending: createPending } = useCreateReport();
  const { mutateAsync: deleteReport } = useDeleteReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    try {
      await createReport({
        title: reportTitle,
        rangeStart: new Date(rangeStart).toISOString(),
        rangeEnd: new Date(rangeEnd).toISOString(),
        format,
      });
      setReportTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = (id: string, filename: string) => {
    // Standard relative link download targeting our proxy handler in Next.js
    const url = `/api/reports/${id}/download`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-55">
          Analytics Reports
        </h1>
        <p className="text-sm text-zinc-400 font-medium">
          Generate, compile, and export channel performance documents.
        </p>
      </div>

      {/* Generate Report Form */}
      <div className="premium-card p-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 border-b border-border-light dark:border-border-dark pb-3 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-500" />
          <span>Compile New Analytical Document</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Document Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                required
                placeholder="e.g. Weekly Engagement Summary"
                className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">File Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-350 focus:outline-none"
              >
                <option value="CSV">Comma Separated values (CSV)</option>
                <option value="PDF">Portable Document format (PDF)</option>
                <option value="EXCEL">Microsoft Excel Sheet (XLSX)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-455">Range Start</label>
              <input
                type="date"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                required
                className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-350 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-455">Range End</label>
              <input
                type="date"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                required
                className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-350 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={createPending}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-glow-blue flex items-center gap-1.5 transition-all"
            >
              {createPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              <span>Compile Report</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reports Table List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Generated Archives</h3>

        <div className="premium-card overflow-hidden">
          {listLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
            </div>
          ) : reports && reports.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-border-light dark:border-border-dark text-[10px] font-bold text-zinc-455 uppercase tracking-wider">
                  <th className="px-6 py-4">Document Title</th>
                  <th className="px-6 py-4">Format</th>
                  <th className="px-6 py-4">Date Range</th>
                  <th className="px-6 py-4">Generated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark text-xs font-semibold text-zinc-900 dark:text-zinc-300">
                {reports.map((report: any) => {
                  const rangeStr = `${new Date(report.rangeStart).toLocaleDateString()} - ${new Date(
                    report.rangeEnd,
                  ).toLocaleDateString()}`;
                  
                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4.5 h-4.5 text-zinc-400" />
                          <span>{report.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] uppercase font-bold rounded">
                          {report.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{rangeStr}</td>
                      <td className="px-6 py-4 text-zinc-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleDownload(report.id, `${report.title.toLowerCase().replace(/\s+/g, '_')}_export.${report.format.toLowerCase()}`)}
                          className="p-1.5 text-zinc-455 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1.5 text-zinc-455 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent"
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-zinc-500 text-xs font-medium">
              No reports compiled yet. Use the selector above to compile your first export.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
