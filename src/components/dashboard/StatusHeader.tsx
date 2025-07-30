import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Activity, Wifi, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusHeaderProps {
  isSystemOnline: boolean;
  totalDevices: number;
  activeDevices: number;
  lastUpdate: Date;
}

export function StatusHeader({ 
  isSystemOnline, 
  totalDevices, 
  activeDevices, 
  lastUpdate 
}: StatusHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-full transition-all duration-300",
            "bg-gradient-to-r from-electric-blue to-electric-cyan shadow-lg"
          )}>
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-cyan bg-clip-text text-transparent">
              VoltInsight Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time IoT voltage monitoring system
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Activity className={cn(
              "h-4 w-4",
              isSystemOnline ? "text-electric-green" : "text-destructive"
            )} />
            <Badge 
              variant="outline" 
              className={cn(
                isSystemOnline 
                  ? "bg-electric-green/20 text-electric-green border-electric-green/30"
                  : "bg-destructive/20 text-destructive border-destructive/30"
              )}
            >
              {isSystemOnline ? "System Online" : "System Offline"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-electric-blue" />
            <span className="text-muted-foreground">
              {activeDevices}/{totalDevices} devices active
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        
        <Button variant="voltage" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}