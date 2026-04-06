"use client";

import {
    MessageTrendHumanVsAiResponse,
    MessageUsageTrendResponse,
    TokenUsageTrendResponse
} from '@/lib/services/analytic/types';
import { AlertCircle, RefreshCcw, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

export default function AnalyticPage() {
  const [tokenData, setTokenData] = useState<TokenUsageTrendResponse[]>([]);
  const [messageData, setMessageData] = useState<MessageUsageTrendResponse[]>([]);
  const [humanVsAiData, setHumanVsAiData] = useState<MessageTrendHumanVsAiResponse[]>([]);
  
  const [humanVsAiPeriod, setHumanVsAiPeriod] = useState<string>('weekly');
  const [isHumanVsAiLoading, setIsHumanVsAiLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDataDate = (data: any[]) => data.map(item => ({
    ...item, 
    _formattedDate: item.date.includes(' ') 
      ? new Date(item.date.replace(' ', 'T')).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      : new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  const fetchHumanVsAi = async (period = humanVsAiPeriod) => {
    setIsHumanVsAiLoading(true);
    try {
        const url = `/api/analytic/humanvsai?period=${period}`;

        const res = await fetch(url);
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Failed to fetch Human vs AI Data");
        
        setHumanVsAiData(formatDataDate(result.data || []));
    } catch (err: any) {
        console.error("Human Vs AI fetch error:", err);
    } finally {
        setIsHumanVsAiLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch concurrently
      const [tokenRes, messageRes] = await Promise.all([
        fetch('/api/analytic/token'),
        fetch('/api/analytic/message')
      ]);

      const [tokenResult, messageResult] = await Promise.all([
        tokenRes.json(),
        messageRes.json()
      ]);

      if (!tokenRes.ok) throw new Error(tokenResult.message || "Failed to fetch Token Usage Data");
      if (!messageRes.ok) throw new Error(messageResult.message || "Failed to fetch Message Trend Data");

      setTokenData(formatDataDate(tokenResult.data));
      setMessageData(formatDataDate(messageResult.data));
      
      // Also fetch human vs ai independently to sync up
      await fetchHumanVsAi(humanVsAiPeriod);

    } catch (err: any) {
      console.error("Analytic fetch error:", err);
      setError(err.message || 'An unexpected error occurred while loading analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-lg text-sm">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600 capitalize">{entry.name}:</span>
              <span className="font-semibold" style={{ color: entry.color }}>
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
               <TrendingUp size={24} />
             </div>
             <h1 className="text-3xl font-bold text-gray-900">Analytics Hub</h1>
           </div>
           <p className="text-gray-500 mt-2 text-lg">Monitor token consumption, traffic volume, and agent performance over time.</p>
        </div>
        
        <button 
          onClick={fetchAnalytics}
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
           <h3 className="text-xl font-semibold text-gray-900">Failed to load analytics</h3>
           <p className="text-red-600 mt-2 font-medium">{error}</p>
           <button 
             onClick={fetchAnalytics}
             className="mt-6 px-6 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg shadow-sm font-medium transition-colors"
           >
             Try Again
           </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="h-80 bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>
             <div className="h-80 bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>
           </div>
           <div className="h-[400px] bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>
        </div>
      ) : (
        <>
          {/* Top Row: Token Trend & Message Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tokens Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
               <h3 className="text-lg font-bold text-gray-900 mb-1">Token Usage Trend</h3>
               <p className="text-sm text-gray-500 mb-6">Aggregate token consumption per day</p>
               
               <div className="flex-1 min-h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={tokenData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis dataKey="_formattedDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                     <Tooltip content={<CustomTooltip />} />
                     <Line 
                        type="monotone" 
                        dataKey="token" 
                        name="Tokens"
                        stroke="#6366f1" 
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Total Messages Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
               <h3 className="text-lg font-bold text-gray-900 mb-1">Total Message Volume</h3>
               <p className="text-sm text-gray-500 mb-6">Daily inbound and outbound messages</p>
               
               <div className="flex-1 min-h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={messageData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis dataKey="_formattedDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                     <Tooltip content={<CustomTooltip />} />
                     <Line 
                        type="monotone" 
                        dataKey="total_message" 
                        name="Messages"
                        stroke="#10b981" 
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>
            
          </div>

          {/* Bottom Row: Human vs AI comparison */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Human vs AI Handled Messages</h3>
                  <p className="text-sm text-gray-500">Compare the volume of messages intercepted by the AI versus those handed off to humans.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <select 
                    value={humanVsAiPeriod}
                    onChange={(e) => {
                        const newPeriod = e.target.value;
                        setHumanVsAiPeriod(newPeriod);
                        fetchHumanVsAi(newPeriod);
                    }}
                    className="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="day">Last 1 Day</option>
                    <option value="weekly">Last 7 Days</option>
                    <option value="monthly">Last 1 Month</option>
                  </select>
                  <button 
                    onClick={() => fetchHumanVsAi()}
                    disabled={isHumanVsAiLoading}
                    className="ml-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCcw size={16} className={isHumanVsAiLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
             </div>
             
             <div className="w-full h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={humanVsAiData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="_formattedDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                   <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                   
                   <Bar 
                     dataKey="ai" 
                     name="AI Agent" 
                     fill="#6366f1" 
                     radius={[4, 4, 0, 0]} 
                     barSize={32}
                   />
                   <Bar 
                     dataKey="human" 
                     name="Human Fallback" 
                     fill="#f59e0b" 
                     radius={[4, 4, 0, 0]} 
                     barSize={32}
                   />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
