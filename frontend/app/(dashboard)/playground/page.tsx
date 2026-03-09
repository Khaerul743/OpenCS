import { PlaygroundInterface } from '@/components/user_dashboard/playground/PlaygroundInterface';

export default function PlaygroundPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div>
         <h1 className="text-3xl font-bold text-gray-900">Playground</h1>
         <p className="text-gray-500 mt-2 text-lg">Test and evaluate your agent's responses in a safe environment.</p>
      </div>

      <PlaygroundInterface />

    </div>
  );
}
