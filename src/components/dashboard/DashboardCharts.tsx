"use client";

import React from "react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

interface ChartProps {
    type: "bar" | "donut" | "area" | "line";
    data: any[];
}

const COLORS = ["#0ea5e9", "#6366f1", "#d946ef", "#f43f5e", "#8b5cf6", "#10b981"];

export default function DashboardCharts({ type, data }: ChartProps) {
    if (type === "area") {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.4} />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: "var(--foreground)", opacity: 0.4 }} 
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: "var(--foreground)", opacity: 0.4 }} 
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: "var(--background)", 
                            borderColor: "var(--border)", 
                            fontSize: "10px", 
                            fontWeight: 900, 
                            borderRadius: "16px",
                            padding: "12px",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                        }} 
                        itemStyle={{ color: "var(--foreground)", textTransform: "uppercase" }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="var(--brand-primary)" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                    />
                    <Area 
                        type="monotone" 
                        dataKey="expected" 
                        stroke="var(--foreground)" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="transparent"
                        opacity={0.2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    if (type === "bar") {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: "var(--foreground)", opacity: 0.4 }} 
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: "var(--foreground)", opacity: 0.4 }} 
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: "var(--background)", 
                            borderColor: "var(--border)", 
                            fontSize: "10px", 
                            fontWeight: 900, 
                            borderRadius: "16px",
                        }} 
                    />
                    <Bar dataKey="expected" fill="var(--foreground)" opacity={0.1} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="actual" fill="var(--brand-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        );
    }

    if (type === "donut") {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: "var(--background)", 
                            borderColor: "var(--border)", 
                            fontSize: "10px", 
                            fontWeight: 900, 
                            borderRadius: "12px",
                        }}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    }

    return null;
}
