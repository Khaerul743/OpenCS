import { Bot, LayoutDashboard, MessageSquare, Zap } from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';
import { AnalyticsGrid } from './AnalyticsGrid';
import { ConversationList } from './ConversationList';
import { TokenChart } from './TokenChart';

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <AnalyticsGrid>
                <AnalyticsCard label="Total Tokens" value={0} icon={Zap} isLoading={true} />
                <AnalyticsCard label="Total Messages" value={0} icon={MessageSquare} isLoading={true} />
                <AnalyticsCard label="Human Takeovers" value={0} icon={LayoutDashboard} isLoading={true} />
                <AnalyticsCard label="Avg Response Time" value={0} icon={Bot} isLoading={true} />
            </AnalyticsGrid>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TokenChart data={[]} isLoading={true} />
                </div>
                <div>
                     <ConversationList conversations={[]} isLoading={true} />
                </div>
            </div>
        </div>
    );
};
