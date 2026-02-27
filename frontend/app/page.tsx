"use client";

import {
    ChevronDown,
    Clock,
    MessageSquare,
    Users,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnalyticsCard } from '../components/dashboard/AnalyticsCard';
import { AnalyticsGrid } from '../components/dashboard/AnalyticsGrid';
import { ConversationList } from '../components/dashboard/ConversationList';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { TokenChart } from '../components/dashboard/TokenChart';
import AppLayout from '../components/layout/AppLayout';

// --- MOCK DATA ---

const MOCK_ANALYTICS = {
  status: "success",
  message: "Analytics retrieved successfully",
  data: {
    total_tokens: 1450230,
    total_messages: 23405,
    total_human_takeovers: 142,
    avg_response_time: 1.8,
    response_rate: 98.5
  }
};

const MOCK_TOKEN_TREND = {
  status: "success",
  message: "Token usage trend retrieved",
  data: Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      token: Math.floor(Math.random() * 50000) + 100000
    };
  })
};

const MOCK_TOP_CONVERSATIONS = {
  status: "success",
  message: "Top conversations retrieved",
  data: [
    {
      id: "conv-1",
      username: "Alice Smith",
      phone_number: "+1 (555) 123-4567",
      status: "active",
      last_message_at: new Date().toISOString(),
      created_at: new Date(Date.now() - 3600000).toISOString(),
      agent_id: "agent-1",
      business_id: "biz-1",
      customer_id: "cust-1"
    },
    {
      id: "conv-2",
      username: "Bob Johnson",
      phone_number: "+1 (555) 987-6543",
      status: "pending",
      last_message_at: new Date(Date.now() - 1800000).toISOString(),
      created_at: new Date(Date.now() - 7200000).toISOString(),
      agent_id: "agent-2",
      business_id: "biz-1",
      customer_id: "cust-2"
    },
    {
      id: "conv-3",
      username: "Carol Williams",
      phone_number: "+1 (555) 555-5555",
      status: "closed",
      last_message_at: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 90000000).toISOString(),
      agent_id: "agent-1",
      business_id: "biz-1",
      customer_id: "cust-3"
    },
    {
        id: "conv-4",
        username: "David Brown",
        phone_number: "+1 (555) 222-3333",
        status: "active",
        last_message_at: new Date(Date.now() - 120000).toISOString(),
        created_at: new Date(Date.now() - 240000).toISOString(),
        agent_id: "agent-3",
        business_id: "biz-1",
        customer_id: "cust-4"
    },
    {
        id: "conv-5",
        username: "Eva Green",
        phone_number: "+1 (555) 444-4444",
        status: "active",
        last_message_at: new Date(Date.now() - 5000).toISOString(),
        created_at: new Date(Date.now() - 10000).toISOString(),
        agent_id: "agent-2",
        business_id: "biz-1",
        customer_id: "cust-5"
    }
  ] as any // Avoid deep type checking issues for mock
};


export default function Dashboard() {
  const [analytics, setAnalytics] = useState<typeof MOCK_ANALYTICS.data | null>(null);
  const [tokenTrend, setTokenTrend] = useState<typeof MOCK_TOKEN_TREND.data | null>(null);
  const [conversations, setConversations] = useState<typeof MOCK_TOP_CONVERSATIONS.data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setAnalytics(MOCK_ANALYTICS.data);
      setTokenTrend(MOCK_TOKEN_TREND.data);
      setConversations(MOCK_TOP_CONVERSATIONS.data);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
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
                   trend={{ value: "-2.1%", isPositive: true }} // Negative is good for takeovers? Or usually red? using green logic for "good" direction might be complex, sticking to simple red/green for Up/Down unless specified
                 /> 
                 <AnalyticsCard 
                   label="Avg Response Time" 
                   value={`${analytics?.avg_response_time}s`} 
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
    </AppLayout>
  );
}
