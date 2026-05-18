"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, FileQuestion } from "lucide-react";
import FormCard from "@/components/dashboard/form-card";
import type { DashboardFormMeta } from "@/services/analytics.service";

export default function FormListClient({
  initialForms,
}: {
  initialForms: DashboardFormMeta[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Draft" | "Encrypted"
  >("All");

  const filteredForms = initialForms.filter((form) => {
    const matchesSearch = form.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || form.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
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

      {/* === FORMS GRID === */}
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
                ? "We couldn't find any forms matching your search criteria."
                : "You haven't created any forms yet."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
