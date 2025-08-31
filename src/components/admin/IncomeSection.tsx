import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, DollarSign, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import { useIncome } from "@/hooks/useIncome";

export function IncomeSection() {
  const { 
    loading,
    incomeStats,
    weeklyData,
    monthlyData,
    categoryData,
    performanceMetrics
  } = useIncome();
  const [timeRange, setTimeRange] = useState("week");

  interface StatCardProps {
    title: string;
    value: number;
    growth: number;
    icon: React.ElementType;
    period: string;
    color?: string;
  }

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    period,
    color = "primary" 
  }: StatCardProps) => (
    <Card className={`border-l-4 border-l-${color} hover:shadow-glow-primary transition-all animate-fade-in`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${value.toLocaleString()}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge 
            variant="secondary" 
            className={growth >= 0 ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {growth > 0 ? "+" : ""}{growth}%
          </Badge>
          <span className="text-xs text-muted-foreground">vs {period}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Income Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your revenue with animated charts and insights
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {/* Income Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-muted rounded mt-2" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-l-4 border-l-success hover:shadow-glow-primary transition-all animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Income
                </CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${incomeStats.today.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-primary hover:shadow-glow-primary transition-all animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Weekly Income
                </CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${incomeStats.weekly.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-warning hover:shadow-glow-primary transition-all animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Income
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${incomeStats.monthly.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-destructive hover:shadow-glow-primary transition-all animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Income
                </CardTitle>
                <Target className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${incomeStats.total.toLocaleString()}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

          {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Income Chart */}
        <Card className="hover:shadow-glow-primary transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Weekly Income Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#incomeGradient)"
                    className="animate-fade-in"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card className="hover:shadow-glow-primary transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Monthly Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar 
                    dataKey="income" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    className="animate-fade-in"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <Card className="hover:shadow-glow-primary transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <div className="h-[250px] bg-muted animate-pulse rounded-lg mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-4 w-8 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      className="animate-fade-in"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>        {/* Performance Metrics */}
        <Card className="lg:col-span-2 hover:shadow-glow-primary transition-all">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-between p-4 bg-gradient-primary rounded-lg text-white animate-pulse">
                    <div>
                      <div className="h-4 w-24 bg-white/20 rounded mb-2" />
                      <div className="h-8 w-32 bg-white/20 rounded" />
                    </div>
                    <div className="h-8 w-8 bg-white/20 rounded" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gradient-primary rounded-lg text-white animate-glow-pulse">
                    <div>
                      <div className="text-sm opacity-90">Average Order Value</div>
                      <div className="text-2xl font-bold">${performanceMetrics.averageOrderValue.toFixed(2)}</div>
                    </div>
                    <DollarSign className="w-8 h-8 opacity-75" />
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Orders Today</div>
                    {loading ? (
                      <div className="h-6 w-12 bg-muted rounded mt-1" />
                    ) : (
                      <div className="text-xl font-bold">{performanceMetrics.ordersToday}</div>
                    )}
                  </div>
                  {loading ? (
                    <div className="h-6 w-24 bg-muted rounded" />
                  ) : (
                    <div className={performanceMetrics.ordersDiff >= 0 ? "text-success" : "text-destructive"}>
                      {performanceMetrics.ordersDiff > 0 ? "+" : ""}{performanceMetrics.ordersDiff} from yesterday
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    {loading ? (
                      <div className="h-6 w-12 bg-muted rounded mt-1" />
                    ) : (
                      <div className="text-xl font-bold">{performanceMetrics.conversionRate}%</div>
                    )}
                  </div>
                  {loading ? (
                    <div className="h-6 w-16 bg-muted rounded" />
                  ) : (
                    <Badge className={performanceMetrics.conversionDiff >= 0 ? "bg-success" : "bg-destructive"}>
                      {performanceMetrics.conversionDiff > 0 ? "+" : ""}{performanceMetrics.conversionDiff}%
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Return Customers</div>
                    {loading ? (
                      <div className="h-6 w-12 bg-muted rounded mt-1" />
                    ) : (
                      <div className="text-xl font-bold">{performanceMetrics.returnCustomers}%</div>
                    )}
                  </div>
                  {loading ? (
                    <div className="h-6 w-16 bg-muted rounded" />
                  ) : (
                    <Badge className={performanceMetrics.returnDiff >= 0 ? "bg-primary" : "bg-destructive"}>
                      {performanceMetrics.returnDiff > 0 ? "+" : ""}{performanceMetrics.returnDiff}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}