"use client";

import {
    AnalyticInsightResponse,
    CategoryPercentageResponse,
    KnowledgeGapResponse
} from '@/lib/services/analytic/types';
import {
    AlertCircle, Lightbulb, TrendingUp, TrendingDown,
    MessageSquare, Tag, Target, Zap, RefreshCcw, Activity, PieChart,
    Info, BookX
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export default function InsightPage() {
    const [insightData, setInsightData] = useState<AnalyticInsightResponse | null>(null);
    const [categoryData, setCategoryData] = useState<CategoryPercentageResponse | null>(null);
    const [knowledgeGapData, setKnowledgeGapData] = useState<KnowledgeGapResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInsights = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [insightRes, categoryRes, gapRes] = await Promise.all([
                fetch('/api/analytic/insight'),
                fetch('/api/analytic/category-percentage'),
                fetch('/api/analytic/knowlage_gap')
            ]);

            const [insightResult, categoryResult, gapResult] = await Promise.all([
                insightRes.json(),
                categoryRes.json(),
                gapRes.json()
            ]);

            if (!insightRes.ok) throw new Error(insightResult.message || "Failed to fetch Insight Data");
            if (!categoryRes.ok) throw new Error(categoryResult.message || "Failed to fetch Category Percentage Data");
            if (!gapRes.ok) throw new Error(gapResult.message || "Failed to fetch Knowledge Gap Data");

            setInsightData(insightResult.data);
            setCategoryData(categoryResult.data);
            setKnowledgeGapData(gapResult.data);
        } catch (err: any) {
            console.error("Insight fetch error:", err);
            setError(err.message || 'An unexpected error occurred while loading insights.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    const parseChange = (changeStr: string) => {
        const isPositive = changeStr.startsWith('+');
        const isNegative = changeStr.startsWith('-');
        const value = changeStr.replace(/[\+\-]/g, '');
        return { isPositive, isNegative, value };
    };

    const getMaxTotal = () => {
        if (!categoryData || !categoryData.summary) return 1;
        return Math.max(...categoryData.summary.map(s => s.total), 1);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                   <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                       <Lightbulb size={24} />
                     </div>
                     <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
                   </div>
                   <p className="text-gray-500 mt-2 text-lg">AI-generated analysis on customer behavior and conversation categories.</p>
                </div>
                
                <button 
                  onClick={fetchInsights}
                  disabled={isLoading}
                  className="flex items-center gap-2 p-2.5 px-4 text-gray-600 hover:text-amber-600 bg-white border border-gray-200 rounded-xl hover:border-amber-200 transition-colors shadow-sm disabled:opacity-50"
                >
                  <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
                  <span className="font-medium text-sm">Refresh Insights</span>
                </button>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
                   <AlertCircle size={48} className="text-red-400 mb-4" />
                   <h3 className="text-xl font-semibold text-gray-900">Failed to load insights</h3>
                   <p className="text-red-600 mt-2 font-medium">{error}</p>
                   <button 
                     onClick={fetchInsights}
                     className="mt-6 px-6 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg shadow-sm font-medium transition-colors"
                   >
                     Try Again
                   </button>
                </div>
            ) : isLoading ? (
                <div className="space-y-6">
                   <div className="h-48 bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="h-96 bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>
                       <div className="h-96 bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>
                   </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Executive Summary / Insight */}
                    {insightData && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="border-b border-gray-100 bg-gray-50/50 p-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Target className="text-indigo-600" size={20} />
                                    Executive Overview
                                </h3>
                                <div className="text-gray-600 mt-3 leading-relaxed text-[15px] prose prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{insightData.overview}</ReactMarkdown>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Activity size={16} /></div>
                                        <h4 className="font-semibold text-gray-900">Key Insight</h4>
                                    </div>
                                    <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{insightData.insight}</ReactMarkdown>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle size={16} /></div>
                                        <h4 className="font-semibold text-gray-900">Reasoning</h4>
                                    </div>
                                    <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{insightData.reason}</ReactMarkdown>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={16} /></div>
                                        <h4 className="font-semibold text-gray-900">Business Impact</h4>
                                    </div>
                                    <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{insightData.impact}</ReactMarkdown>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Zap size={16} /></div>
                                        <h4 className="font-semibold text-gray-900">Recommendation</h4>
                                    </div>
                                    <div className="text-sm text-gray-600 leading-relaxed prose prose-sm prose-p:my-1 max-w-none whitespace-pre-line">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{insightData.recommendation}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Knowledge Gap Insight */}
                    {knowledgeGapData && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
                            <div className="border-b border-gray-100 bg-red-50/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <BookX className="text-red-500" size={20} />
                                        Knowledge Gap Insight
                                        <div className="group relative flex items-center cursor-help">
                                            <Info size={16} className="text-gray-400 hover:text-gray-600 transition-colors ml-1" />
                                            {/* Tooltip */}
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-gray-900 text-white text-xs p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-normal">
                                                Pusat gap bisnis menunjukkan informasi bisnis yang belum diketahui oleh AI Customer Service. Melengkapi business knowledge sangat penting!
                                                <div className="absolute right-0 left-0 -bottom-1 mx-auto w-2 h-2 bg-gray-900 rotate-45 transform"></div>
                                            </div>
                                        </div>
                                    </h3>
                                    <p className="text-gray-600 mt-2 leading-relaxed text-[15px] max-w-3xl">Poin-poin di bawah ini adalah kekurangan informasi relevan yang sebaiknya segera Anda tambahkan ke Bisnis Anda.</p>
                                </div>
                                <div className="mt-4 md:mt-0 flex-shrink-0">
                                    <Link href="/business" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                                        Tambah Knowledge Baru
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                                <div className="p-6 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={16} /></div>
                                        <h4 className="font-semibold text-gray-900">Insight Kekurangan</h4>
                                    </div>
                                    <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{knowledgeGapData.insight}</ReactMarkdown>
                                    </div>
                                </div>
                                <div className="p-6 lg:col-span-1 border-b lg:border-b-0">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><Activity size={16} /></div>
                                        <h4 className="font-semibold text-gray-900">Gap Pengetahuan Teridentifikasi</h4>
                                    </div>
                                    <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{knowledgeGapData.knowladge_business_gap}</ReactMarkdown>
                                    </div>
                                </div>
                                <div className="p-6 lg:col-span-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Zap size={16} /></div>
                                        <h4 className="font-semibold text-gray-900">Tindakan Perbaikan yang Disarankan</h4>
                                    </div>
                                    <div className="text-sm text-gray-600 leading-relaxed prose prose-sm prose-p:my-1 max-w-none whitespace-pre-line">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{knowledgeGapData.recommendation}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Categories Summary */}
                        {categoryData && categoryData.summary && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                                    <PieChart className="text-indigo-600" size={20} />
                                    Category Distribution
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">Volume and trend changes across conversation topics.</p>
                                
                                <div className="space-y-4">
                                    {categoryData.summary.map((item, idx) => {
                                        const change = parseChange(item.change);
                                        const percentage = (item.total / getMaxTotal()) * 100;
                                        return (
                                            <div key={idx} className="group p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Tag size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                                        <span className="font-semibold text-gray-800 capitalize">{item.category_type}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg font-bold text-gray-900">{item.total}</span>
                                                        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                                                            change.isPositive ? 'bg-emerald-100 text-emerald-700' : 
                                                            change.isNegative ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {change.isPositive ? <TrendingUp size={12} className="mr-1" /> : 
                                                             change.isNegative ? <TrendingDown size={12} className="mr-1" /> : null}
                                                            {item.change}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" 
                                                        style={{ width: `${Math.max(percentage, 5)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Sample Messages */}
                        {categoryData && categoryData.samples && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full max-h-[600px]">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                                    <MessageSquare className="text-indigo-600" size={20} />
                                    Sample Inquiries
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">Real examples of customer questions by category.</p>
                                
                                <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                                    {categoryData.samples.map((sample, idx) => (
                                        <div key={idx} className="space-y-3">
                                            <h4 className="text-sm font-semibold text-gray-900 capitalize px-2 border-l-2 border-indigo-500">
                                                {sample.category_type}
                                            </h4>
                                            <div className="flex flex-col gap-2 pl-3">
                                                {sample.sample_messages.map((msg, mIdx) => (
                                                    <div key={mIdx} className="bg-gray-50 border border-gray-100 text-gray-700 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm w-fit max-w-[90%]">
                                                        {msg}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
