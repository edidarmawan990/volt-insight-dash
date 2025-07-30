import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color: "voltage" | "current" | "power" | "cost";
  status?: "normal" | "warning" | "critical";
}

const colorVariants = {
  voltage: {
    card: "bg-gradient-to-br from-electric-blue/5 to-electric-blue/10 border-electric-blue/20",
    icon: "text-electric-blue",
    value: "text-electric-blue",
    glow: "shadow-lg shadow-electric-blue/10"
  },
  current: {
    card: "bg-gradient-to-br from-electric-cyan/5 to-electric-cyan/10 border-electric-cyan/20", 
    icon: "text-electric-cyan",
    value: "text-electric-cyan",
    glow: "shadow-lg shadow-electric-cyan/10"
  },
  power: {
    card: "bg-gradient-to-br from-electric-green/5 to-electric-green/10 border-electric-green/20",
    icon: "text-electric-green", 
    value: "text-electric-green",
    glow: "shadow-lg shadow-electric-green/10"
  },
  cost: {
    card: "bg-gradient-to-br from-electric-amber/5 to-electric-amber/10 border-electric-amber/20",
    icon: "text-electric-amber",
    value: "text-electric-amber", 
    glow: "shadow-lg shadow-electric-amber/10"
  }
};

const statusColors = {
  normal: "bg-electric-green/20 text-electric-green border-electric-green/30",
  warning: "bg-electric-amber/20 text-electric-amber border-electric-amber/30", 
  critical: "bg-destructive/20 text-destructive border-destructive/30"
};

export function MetricCard({ 
  title, 
  value, 
  unit, 
  icon, 
  trend, 
  trendValue, 
  color, 
  status = "normal" 
}: MetricCardProps) {
  const styles = colorVariants[color];
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:scale-105",
      styles.card,
      styles.glow
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("h-6 w-6", styles.icon)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className={cn("text-2xl font-bold transition-all duration-300", styles.value)}>
              {value.toFixed(2)} <span className="text-lg">{unit}</span>
            </div>
            {trendValue && (
              <p className="text-xs text-muted-foreground mt-1">
                {trend === "up" && "↗ "}
                {trend === "down" && "↘ "}
                {trend === "stable" && "→ "}
                {trendValue}
              </p>
            )}
          </div>
          <Badge variant="outline" className={cn("text-xs", statusColors[status])}>
            {status}
          </Badge>
        </div>
      </CardContent>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r opacity-5 pointer-events-none",
        color === "voltage" && "from-electric-blue to-transparent",
        color === "current" && "from-electric-cyan to-transparent", 
        color === "power" && "from-electric-green to-transparent",
        color === "cost" && "from-electric-amber to-transparent"
      )} />
    </Card>
  );
}