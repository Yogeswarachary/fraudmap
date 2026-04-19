"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simulating data: Steps 0 to 23 (One day)
const data = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  // Higher risk (baseline 40) during your 12AM-6AM window
  risk: (i >= 0 && i <= 6) ? 45 + Math.random() * 20 : 10 + Math.random() * 15
}));

export function RiskChart() {
  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl border">
      <h3 className="text-sm lowercase tracking-wider text-gray-800">Average Risk Score by Hour (Live Patterns)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="hour" fontSize={12} tickMargin={10} />
          <YAxis fontSize={12} domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
