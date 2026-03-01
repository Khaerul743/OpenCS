import AppLayout from '@/components/user_dashboard/layout/AppLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}