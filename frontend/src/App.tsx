import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertTriangle, FileWarning, ArrowRight } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/expenses/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReport(response.data);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-md shadow-sm rounded-2xl p-6 border border-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
              Shared Expenses
            </h1>
            <p className="text-gray-500 font-medium mt-1">Settle up effortlessly with your flatmates</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Dashboard
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md text-sm font-semibold text-white transition transform hover:-translate-y-0.5">
              New Expense
            </button>
          </div>
        </header>

        {/* Upload Section */}
        {!report && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-50 text-indigo-500 mb-6 shadow-inner">
                <UploadCloud size={48} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Import Expenses</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Upload your <span className="font-semibold text-gray-700">expenses_export.csv</span> file to migrate your data. Our AI-driven importer will detect anomalies and handle them automatically.
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <label className="cursor-pointer group">
                  <div className="px-6 py-3 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 text-indigo-600 font-medium group-hover:border-indigo-400 group-hover:bg-indigo-50 transition flex items-center space-x-2">
                    <span>{file ? file.name : 'Choose CSV File'}</span>
                    <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                  </div>
                </label>
                
                <button 
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2"
                >
                  {loading ? 'Processing...' : 'Upload & Scan'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Section */}
        {report && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="text-green-500" />
                  Scan Complete
                </h2>
                <p className="text-gray-500 mt-2">
                  Processed {report.processed.length} expenses. Found {report.anomalies.length} anomalies.
                </p>
              </div>
              <button className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl shadow-md text-sm font-semibold text-white transition">
                Confirm & Save Import
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <FileWarning className="text-orange-500" size={20} />
                <h3 className="font-bold text-gray-800">Anomaly Log & Actions Taken</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {report.anomalies.map((anomaly: any, idx: number) => (
                  <div key={idx} className="p-6 hover:bg-gray-50/50 transition flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Row {anomaly.rowNum}</span>
                        <span className="font-semibold text-gray-900">{anomaly.description || 'Unknown'}</span>
                      </div>
                      <ul className="space-y-1">
                        {anomaly.anomalies.map((msg: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <AlertTriangle size={14} className="text-orange-400 mt-0.5 shrink-0" />
                            {msg}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="shrink-0">
                      <span className={\`px-3 py-1 rounded-full text-xs font-bold \${
                        anomaly.action === 'Skipped' ? 'bg-red-100 text-red-700' :
                        anomaly.action === 'Flagged for Review' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }\`}>
                        {anomaly.action}
                      </span>
                    </div>
                  </div>
                ))}
                {report.anomalies.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No anomalies found! Perfect dataset.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
