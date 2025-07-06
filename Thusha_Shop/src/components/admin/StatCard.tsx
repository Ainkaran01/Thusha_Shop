import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  variant?: "blue" | "red" | "green" | "yellow" | "gray"; // Add your preferred variants
}

const variantClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800",
  red: "bg-red-100 text-red-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  gray: "bg-gray-100 text-gray-800",
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  variant = "gray", // Default variant
}) => {
  const colorClass = variantClasses[variant] || variantClasses["gray"];

  return (
    <Card className={`hover:shadow-lg transition-shadow ${colorClass}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs opacity-80">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
