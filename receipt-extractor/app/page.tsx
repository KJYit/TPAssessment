'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    merchant: '',
    date: '',
    total: '',
    currency: '',
  });
  const [savedData, setSavedData] = useState<any[]>([]);

  // 1. Handle File Processing
  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);

    // Auto-extract immediately after file is selected
    setLoading(true);
    const data = new FormData();
    data.append('receipt', selectedFile);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('API request failed');

      const result = await response.json();
      setFormData({
        merchant: result.merchant_name || result.merchant || '',
        date: result.date || '',
        total: result.total_amount || result.total || '',
        currency: result.currency || '',
      });
    } catch (error) {
      console.error(error);
      alert('Failed to extract data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // 2. Handle Form Edits
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Submit Final Data 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedData([...savedData, formData]);
    // Reset form
    setFormData({ merchant: '', date: '', total: '', currency: '' });
    setFile(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            AI Receipt Extractor
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Upload a receipt and let generative AI extract the details for you.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 shadow-sm ring-1 ring-slate-900/5 rounded-2xl">
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
              ${loading ? 'border-indigo-300 bg-indigo-50/50' : 
                isDragging ? 'border-indigo-500 bg-indigo-50 shadow-inner' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {loading ? (
                // Loading Spinner
                <svg className="animate-spin h-10 w-10 text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                // Upload Icon
                <svg className="w-10 h-10 mb-3 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
              )}
              <p className="mb-2 text-sm font-medium text-slate-600">
                {loading ? 'Analyzing receipt with AI...' : (
                  <span className="text-indigo-600 font-semibold">Click to upload</span>
                )}
                {!loading && " or drag and drop"}
              </p>
              <p className="text-xs text-slate-500">PNG, JPG or JPEG</p>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </label>
        </div>

        {/* Editable Form Section */}
        <div className={`bg-white shadow-sm ring-1 ring-slate-900/5 rounded-2xl p-6 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Extracted Details</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Merchant Name</label>
                <input
                  type="text"
                  name="merchant"
                  value={formData.merchant}
                  onChange={handleInputChange}
                  placeholder="e.g. Starbucks"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="e.g. 2024-05-12"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Total Amount</label>
                <input
                  type="text"
                  name="total"
                  value={formData.total}
                  onChange={handleInputChange}
                  placeholder="e.g. 15.50"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Currency</label>
                <input
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  placeholder="e.g. USD"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.merchant && !formData.total}
              className="mt-6 w-full bg-indigo-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Confirm & Save Receipt
            </button>
          </form>
        </div>

        {/* Display Saved Data Section */}
        {savedData.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Saved Receipts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedData.map((receipt, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-l-2xl"></div>
                  <div className="flex justify-between items-start pl-2">
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">{receipt.merchant || 'Unknown Merchant'}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{receipt.date || 'No date provided'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        {receipt.currency}
                      </span>
                      <p className="text-xl font-extrabold text-slate-900 mt-1">
                        {receipt.total}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}