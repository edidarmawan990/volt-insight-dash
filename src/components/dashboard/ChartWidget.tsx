import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";
import { cn } from "@/lib/utils";

interface ChartData {
  time: string;
  voltage: number;
  current: number;
  power: number;
}

interface ChartWidgetProps {
  title: string;
  data: ChartData[];
  dataKey: keyof Omit<ChartData, 'time'>;
  color: "voltage" | "current" | "power";
  unit: string;
  type?: "line" | "area";
}

const colorConfig = {
  voltage: {
    stroke: "hsl(var(--electric-blue))",
    fill: "hsl(var(--electric-blue) / 0.1)",
    gradient: "from-electric-blue/20 to-electric-blue/5"
  },
  current: {
    stroke: "hsl(var(--electric-cyan))", 
    fill: "hsl(var(--electric-cyan) / 0.1)",
    gradient: "from-electric-cyan/20 to-electric-cyan/5"
  },
  power: {
    stroke: "hsl(var(--electric-green))",
    fill: "hsl(var(--electric-green) / 0.1)", 
    gradient: "from-electric-green/20 to-electric-green/5"
  }
};

export function ChartWidget({ 
  title, 
  data, 
  dataKey, 
  color, 
  unit, 
  type = "area" 
}: ChartWidgetProps) {
  const config = colorConfig[color];
  
  return (
    <Card className={cn(
      "transition-all duration-300 hover:scale-[1.02]",
      `bg-gradient-to-br ${config.gradient} border-${color === 'voltage' ? 'electric-blue' : color === 'current' ? 'electric-cyan' : 'electric-green'}/20`
    )}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            ({unit})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {type === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.stroke} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={config.stroke} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={config.stroke}
                  strokeWidth={2}
                  fill={`url(#gradient-${color})`}
                  fillOpacity={1}
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={config.stroke}
                  strokeWidth={3}
                  dot={{ fill: config.stroke, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: config.stroke, strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}