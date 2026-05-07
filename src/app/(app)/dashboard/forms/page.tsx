"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, SlidersHorizontal, FileQuestion } from "lucide-react";
import FormCard from "@/components/dashboard/form-card";

// Mock Data Forms (Bisa diganti nanti pas integrasi API/Smart Contract)
const MOCK_FORMS = [
  {
    id: "1",
    title: "Web3 Developer Survey 2026",
    status: "Active" as const,
    responses: 842,
    lastModified: "1 hour ago",
    blobId: "0x8f2a...7c91wal",
  },
  {
    id: "2",
    title: "Anonymous Bug Bounty Report",
    status: "Encrypted" as const,
    responses: 15,
    lastModified: "3 hours ago",
    blobId: "0x3b1c...4d22wal",
  },
  {
    id: "3",
    title: "DeFi Protocol Feedback",
    status: "Active" as const,
    responses: 128,
    lastModified: "1 day ago",
    blobId: "0x9a4f...1e55wal",
  },
  {
    id: "4",
    title: "Team Evaluation Q1",
    status: "Draft" as const,
    responses: 0,
    lastModified: "2 days ago",
  },
  {
    id: "5",
    title: "Whistleblower Secure Channel",
    status: "Encrypted" as const,
    responses: 3,
    lastModified: "1 week ago",
    blobId: "0x77cf...88b0wal",
  },
];

export default function MyFormsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Draft" | "Encrypted"
  >("All");

  // Logika Filter & Search
  const filteredForms = MOCK_FORMS.filter((form) => {
    const matchesSearch = form.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || form.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* === HEADER & ACTIONS === */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Forms
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your decentralized forms and analyze responses.
          </p>
        </div>

        <Link
          href="/dashboard/forms/create"
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 shrink-0"
        >
          <Plus size={20} />
          Create Form
        </Link>
      </div>

      {/* === SEARCH & FILTER BAR === */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search forms by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>

        <div className="relative shrink-0">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full sm:w-48 bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer font-medium"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Encrypted">Encrypted</option>
            <option value="Draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* === FORMS GRID / EMPTY STATE === */}
      <div className="flex-1">
        {filteredForms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
            {filteredForms.map((form) => (
              <FormCard key={form.id} {...form} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-card/50 border border-dashed border-border rounded-2xl text-center p-6">
            <div className="bg-muted p-4 rounded-full mb-4 text-muted-foreground">
              <FileQuestion size={32} />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              No forms found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery
                ? "We couldn't find any forms matching your search criteria. Try adjusting your filters."
                : "You haven't created any forms yet. Start building your first decentralized form today!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
