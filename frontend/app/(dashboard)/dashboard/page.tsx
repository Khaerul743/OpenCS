"use client";

import { AnalyticsCard } from '@/components/user_dashboard/dashboard/AnalyticsCard';
import { AnalyticsGrid } from '@/components/user_dashboard/dashboard/AnalyticsGrid';
import { ConversationList } from '@/components/user_dashboard/dashboard/ConversationList';
import { DashboardSkeleton } from '@/components/user_dashboard/dashboard/DashboardSkeleton';
import { TokenChart } from '@/components/user_dashboard/dashboard/TokenChart';
import { DashboardResponse } from '@/lib/services/dashboard/types';
import {
  AlertCircle,
  ChevronDown,
  Clock,
  MessageSquare,
  Users,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/dashboard');
        
        if (response.status === 401) {
          router.push('/login');
          return;
        }

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message || 'Failed to fetch dashboard data');
        }

        const { data } = resData;

        if (!data || !data.analytic_cards || !data.token_usage_trend || !data.list_conversation) {
          throw new Error('Some required dashboard data could not be loaded.');
        }

        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-xl border border-red-100 p-8 my-8">
        <div className="text-red-500 mb-4 bg-red-100 p-4 rounded-full">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-red-900 mb-2">Failed to load dashboard</h3>
        <p className="text-red-700 text-center mb-6 max-w-md">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const analytics = dashboardData?.analytic_cards;
  const tokenTrend = dashboardData?.token_usage_trend;
  const conversations = dashboardData?.list_conversation;

  return (
    <>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
             <p className="text-gray-500 mt-1">Real-time insights into your agent performance.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
               <span>Last 7 Days</span>
               <ChevronDown size={14} />
             </button>
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md">
               Export Data
             </button>
          </div>
        </div>

        {loading ? (
           <DashboardSkeleton />
        ) : (
           <>
              {/* Analytics Grid */}
              <AnalyticsGrid>
                 <AnalyticsCard 
                   label="Total Tokens" 
                   value={(analytics?.total_tokens || 0).toLocaleString()} 
                   icon={Zap} 
                   trend={{ value: "+12.5%", isPositive: true }}
                 />
                 <AnalyticsCard 
                   label="Total Messages" 
                   value={(analytics?.total_messages || 0).toLocaleString()} 
                   icon={MessageSquare} 
                   trend={{ value: "+5.2%", isPositive: true }}
                 />
                 <AnalyticsCard 
                   label="Human Takeovers" 
                   value={analytics?.total_human_takeovers || 0} 
                   icon={Users} 
                   trend={{ value: "-2.1%", isPositive: true }}
                 /> 
                 <AnalyticsCard 
                   label="Avg Response Time" 
                   value={`${analytics?.avg_response_time?.toFixed(2) || 0}s`} 
                   icon={Clock} 
                   trend={{ value: "-0.3s", isPositive: true }}
                 />
              </AnalyticsGrid>

              {/* Main Content Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 
                 {/* Chart Calculator */}
                 <div className="lg:col-span-2">
                    <TokenChart data={tokenTrend || []} />
                 </div>

                 {/* Top Conversations */}
                 <div className="lg:col-span-1">
                    <ConversationList conversations={conversations || []} />
                 </div>

              </div>
           </>
        )}

      </div>
    </>
  );
}
