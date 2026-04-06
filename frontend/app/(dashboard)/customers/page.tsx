"use client";

import { useEffect, useState } from 'react';
import { Users, AlertCircle, RefreshCcw, Search } from 'lucide-react';
import { GetCustomersResponse } from '@/lib/services/business/types';

export default function CustomersPage() {
  const [data, setData] = useState<GetCustomersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/business/customers');
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.message || "Failed to fetch customers data");
      
      setData(result.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = data?.customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone_number.includes(searchTerm)
  ) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
               <Users size={24} />
             </div>
             <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
           </div>
           <p className="text-gray-500 mt-2 text-lg">Manage your interactive audience list and their AI-enablement standing.</p>
        </div>
        
        <button 
          onClick={fetchCustomers}
          disabled={isLoading}
          className="flex items-center gap-2 p-2.5 px-4 text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
          <span className="font-medium text-sm">Refresh Data</span>
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
           <AlertCircle size={48} className="text-red-400 mb-4" />
           <h3 className="text-xl font-semibold text-gray-900">Failed to load customers</h3>
           <p className="text-red-600 mt-2 font-medium">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-6">
           <div className="h-32 w-full md:w-1/3 bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>
           <div className="h-[400px] bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{data.total_customers}</p>
                </div>
                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                  <Users size={24} />
                </div>
             </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border text-left border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-lg">Customer List</h3>
              <div className="relative w-full sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search name or phone..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">WA ID</th>
                    <th className="px-6 py-4">AI Status</th>
                    <th className="px-6 py-4 text-right">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No customers found matching "{searchTerm}"
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 text-gray-600">{customer.phone_number}</td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{customer.wa_id}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${customer.enable_ai ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {customer.enable_ai ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500">
                          {new Date(customer.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
