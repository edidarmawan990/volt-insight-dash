import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Power, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocketControlProps {
  socketId: string;
  name: string;
  isOnline: boolean;
  isOn: boolean;
  onToggle: (socketId: string, newState: boolean) => void;
}

export function SocketControl({ 
  socketId, 
  name, 
  isOnline, 
  isOn, 
  onToggle 
}: SocketControlProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onToggle(socketId, !isOn);
    setIsLoading(false);
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:scale-105",
      "bg-gradient-to-br from-secondary/50 to-secondary/20 border-border/50",
      isOn && "shadow-lg shadow-electric-green/20 border-electric-green/30",
      !isOnline && "opacity-75"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-electric-green" />
            ) : (
              <WifiOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                isOnline 
                  ? "bg-electric-green/20 text-electric-green border-electric-green/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
        <div className={cn(
          "p-2 rounded-full transition-colors duration-300",
          isOn 
            ? "bg-electric-green/20 text-electric-green" 
            : "bg-muted text-muted-foreground"
        )}>
          <Power className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Status: <span className={cn(
              "font-medium",
              isOn ? "text-electric-green" : "text-muted-foreground"
            )}>
              {isOn ? "ON" : "OFF"}
            </span>
          </div>
          <Button
            variant="socket"
            size="lg"
            onClick={handleToggle}
            disabled={!isOnline || isLoading}
            className={cn(
              "transition-all duration-300",
              isOn && "bg-electric-green/10 text-electric-green border-electric-green/30 hover:bg-electric-green/20"
            )}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <>
                <Power className="h-4 w-4" />
                {isOn ? "Turn OFF" : "Turn ON"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
      
      {/* Animated glow effect when on */}
      {isOn && (
        <div className="absolute inset-0 bg-gradient-to-r from-electric-green/5 to-transparent opacity-50 pointer-events-none animate-pulse" />
      )}
    </Card>
  );
}