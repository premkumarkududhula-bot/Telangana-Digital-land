
import React from 'react';
import { Transaction } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  transactions: Transaction[];
  totalAdminRevenue: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ transactions, totalAdminRevenue }) => {
  const chartData = transactions.slice(-10).map((t, idx) => ({
    name: idx + 1,
    amount: t.amount,
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-morphism p-6 rounded-3xl">
          <p className="text-sm text-slate-400 font-medium mb-1">Total Admin Revenue</p>
          <h3 className="text-4xl font-black text-emerald-400">₹{totalAdminRevenue}</h3>
          <p className="text-xs text-slate-500 mt-2">Platform initial sales commission</p>
        </div>
        <div className="glass-morphism p-6 rounded-3xl">
          <p className="text-sm text-slate-400 font-medium mb-1">Total Transactions</p>
          <h3 className="text-4xl font-black text-indigo-400">{transactions.length}</h3>
          <p className="text-xs text-slate-500 mt-2">Successful asset transfers</p>
        </div>
        <div className="glass-morphism p-6 rounded-3xl">
          <p className="text-sm text-slate-400 font-medium mb-1">Volume Multiplier</p>
          <h3 className="text-4xl font-black text-orange-400">2.0x</h3>
          <p className="text-xs text-slate-500 mt-2">Value growth per transaction</p>
        </div>
      </div>

      <div className="glass-morphism p-6 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-6">Volume Growth (Last 10 TXs)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-morphism p-6 rounded-3xl overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-6">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-widest font-semibold">
                <th className="pb-4 px-2">Slot</th>
                <th className="pb-4 px-2">Buyer</th>
                <th className="pb-4 px-2">Seller</th>
                <th className="pb-4 px-2">Amount</th>
                <th className="pb-4 px-2 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.slice().reverse().map((tx) => (
                <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 px-2 text-slate-300 font-mono">#{tx.slotId}</td>
                  <td className="py-4 px-2 text-white font-medium">{tx.buyerName}</td>
                  <td className="py-4 px-2 text-slate-400">{tx.sellerName}</td>
                  <td className="py-4 px-2 text-emerald-400 font-bold">₹{tx.amount}</td>
                  <td className="py-4 px-2 text-slate-500 text-right text-xs">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 italic">No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
