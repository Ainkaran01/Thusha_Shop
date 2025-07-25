
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalesDataPoint {
  month: string;
  online: number;
  pos: number;
}

interface CategoryDataPoint {
  id: string;
  value: number;
}

interface DashboardChartsProps {
  salesData: SalesDataPoint[];
  categoryData: CategoryDataPoint[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ salesData, categoryData }) => {
  const isMobile = useIsMobile();
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Transform data for pie chart format
  const pieData = categoryData.map(item => ({
    name: item.id,
    value: item.value
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <Card className="col-span-1 md:col-span-7">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly revenue for the current year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {!isMobile ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    label={{ value: 'Revenue ($)', angle: -90, position: 'outsideLeft',offset: 10, }} 
                  />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="online" stroke="#4f46e5" name="Online Orders" />
                  <Line type="monotone" dataKey="pos" stroke="#10b981" name="Point Of Sales" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Charts available on desktop view</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-5">
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>Sales distribution by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {!isMobile ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Value']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Charts available on desktop view</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
