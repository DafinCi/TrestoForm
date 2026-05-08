"use client";

import React, { useState } from "react";
import { Lock, Unlock, Download, Eye, Search } from "lucide-react";

export default function SubmissionsTable() {
  const [isDecrypted, setIsDecrypted] = useState(false);

  // Simulasi data mentah dari Walrus (Terenkripsi)
  const mockData = [
    {
      id: "TX-9921",
      date: "2024-05-20",
      wallet: "0x71...2a1",
      email: "enc_92jKsl...",
      feedback: "enc_Ls02kXp...",
    },
    {
      id: "TX-9920",
      date: "2024-05-19",
      wallet: "0x88...1b4",
      email: "enc_Pq01mN...",
      feedback: "enc_An92kZm...",
    },
    {
      id: "TX-9919",
      date: "2024-05-19",
      wallet: "0x12...9f2",
      email: "enc_Xy88tB...",
      feedback: "enc_Qw11vLr...",
    },
  ];

  // Data hasil dekripsi
  const decryptedFields = [
    {
      email: "vitalik@ethereum.org",
      feedback: "The UI is super clean, love the Walrus integration!",
    },
    {
      email: "satoshi@bitcoin.com",
      feedback: "Great implementation of client-side privacy.",
    },
    {
      email: "user@sui.io",
      feedback: "Fastest form I've ever filled in Web3.",
    },
  ];

  return (
    <div className="bg-card border-2 border-border rounded-2xl overflow-hidden mt-8">
      {/* Table Header / Toolbar */}
      <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by wallet or ID..."
            className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsDecrypted(!isDecrypted)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              isDecrypted
                ? "bg-emerald-500 text-white"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {isDecrypted ? <Unlock size={16} /> : <Lock size={16} />}
            {isDecrypted ? "Data Decrypted" : "Decrypt All (Seal)"}
          </button>
          <button className="p-2 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors">
            <Download size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Actual Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Submission ID</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Respondent (Wallet)</th>
              <th className="px-6 py-4 font-bold">Email</th>
              <th className="px-6 py-4 font-bold">Feedback</th>
              <th className="px-6 py-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockData.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-muted/20 transition-colors group"
              >
                <td className="px-6 py-4 text-sm font-mono text-primary font-bold">
                  {row.id}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {row.date}
                </td>
                <td className="px-6 py-4 text-sm font-medium">{row.wallet}</td>
                <td className="px-6 py-4 text-sm">
                  {isDecrypted ? (
                    <span className="text-foreground animate-in fade-in duration-500">
                      {decryptedFields[index].email}
                    </span>
                  ) : (
                    <span className="bg-muted text-muted-foreground/30 px-2 py-0.5 rounded blur-[3px] select-none text-xs">
                      encrypted_data
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm max-w-xs truncate">
                  {isDecrypted ? (
                    <span className="text-foreground animate-in fade-in duration-700">
                      {decryptedFields[index].feedback}
                    </span>
                  ) : (
                    <span className="bg-muted text-muted-foreground/30 px-2 py-0.5 rounded blur-[3px] select-none text-xs">
                      encrypted_feedback_blob
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
