"use client";
// 1. Added useEffect to the import list
import React, { useState, useEffect } from 'react';
import { RiskChart } from "@/components/RiskChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateRiskScoreDetailed } from "@/lib/riskEngine";

export default function FraudMapDashboard() {
  const [amount, setAmount] = useState(500);
  const [step, setStep] = useState(4);
  const [isNew, setIsNew] = useState(false);
  
  // 2. State for the ID
  const [txnId, setTxnId] = useState("");

  // 3. Generate ID only on the client side
  useEffect(() => {
    const newId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setTxnId(newId);
  }, []); 

  const scoreData = calculateRiskScoreDetailed({ amount, step, isNewRecipient: isNew });

  return (
    <main className="p-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">FraudMap Risk Engine</h1>
      <RiskChart />
      
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white font-bold">Test a Transaction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Amount (INR)</label>
            <input 
              type="number" 
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white font-bold" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Step (Hour 0-740)</label>
            <input 
              type="number" 
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white font-bold" 
              value={step} 
              onChange={(e) => setStep(Number(e.target.value))}
            />
            <p className="text-sm font-semibold text-cyan-400 mt-2">Hour of day: {step % 24}:00</p>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={isNew} 
              onChange={(e) => setIsNew(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-sm font-bold text-slate-300">Is this a new Recipient/Merchant?</label>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6 pb-10 text-center flex flex-col items-center justify-center">
          <div className="mb-4 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
              {/* 4. Use the state variable txnId here */}
              ID: {txnId || "GENERATING..."}
            </p>
          </div>
          
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Calculated Risk Score</p>
          
          <div className={`text-7xl font-black text-cyan-400 my-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]`}>
            {scoreData.totalScore}
          </div>
          
          <p className={`text-xl font-bold tracking-wide ${scoreData.color}`}>
            {scoreData.label}
          </p>

          <div className="mt-6 w-full border-t border-slate-800 pt-4 text-left">
            <p className="text-xs font-bold text-slate-500 uppercase mb-3 px-2">Risk Breakdown</p>
            <div className="space-y-2">
              {scoreData.factors.map((f, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-800/50 p-2 rounded px-3 border border-slate-700">
                  <span className="text-sm text-slate-200 font-medium">
                    {f.points > 0 ? "⚠️" : "✅"} {f.message}
                  </span>
                  <span className={`text-xs font-mono font-bold ${f.points > 0 ? "text-red-400" : "text-green-400"}`}>
                    {f.points > 0 ? `+${f.points}` : f.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <footer className="pt-10 pb-5 text-center border-t border-slate-800">
        <p className="text-xs text-slate-500 font-medium">
          Analysis performed by <span className="text-cyan-400">FraudMap V1.0</span> — Real-time rule-based engine
        </p>
      </footer>
    </main>
  );
}
