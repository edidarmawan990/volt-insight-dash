import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Eye, EyeOff, TestTube } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FirebaseConfig {
  url: string;
  authKey: string;
}

interface FirebaseConfigPanelProps {
  onConfigSave: (config: FirebaseConfig) => void;
  currentConfig?: FirebaseConfig;
}

export function FirebaseConfigPanel({ onConfigSave, currentConfig }: FirebaseConfigPanelProps) {
  const [config, setConfig] = useState<FirebaseConfig>({
    url: currentConfig?.url || "",
    authKey: currentConfig?.authKey || ""
  });
  const [showAuthKey, setShowAuthKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSave = () => {
    if (config.url && config.authKey) {
      onConfigSave(config);
      localStorage.setItem('firebase-config', JSON.stringify(config));
    }
  };

  const testConnection = async () => {
    if (!config.url || !config.authKey) return;
    
    setIsTestingConnection(true);
    try {
      const response = await fetch(`${config.url}?auth=${config.authKey}`);
      if (response.ok) {
        setConnectionStatus("success");
      } else {
        setConnectionStatus("error");
      }
    } catch (error) {
      setConnectionStatus("error");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const isConfigValid = config.url && config.authKey;

  return (
    <Card className="bg-gradient-to-br from-secondary/50 to-secondary/20 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-electric-blue" />
          Firebase Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firebase-url">Firebase Database URL</Label>
          <Input
            id="firebase-url"
            placeholder="https://your-project.firebaseio.com/path.json"
            value={config.url}
            onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="auth-key">Authentication Key</Label>
          <div className="relative">
            <Input
              id="auth-key"
              type={showAuthKey ? "text" : "password"}
              placeholder="Your Firebase auth key"
              value={config.authKey}
              onChange={(e) => setConfig(prev => ({ ...prev, authKey: e.target.value }))}
              className="font-mono text-sm pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowAuthKey(!showAuthKey)}
            >
              {showAuthKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={handleSave}
            disabled={!isConfigValid}
            variant="electric"
            className="flex-1"
          >
            <Settings className="h-4 w-4" />
            Save Configuration
          </Button>
          
          <Button
            onClick={testConnection}
            disabled={!isConfigValid || isTestingConnection}
            variant="voltage"
          >
            {isTestingConnection ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <TestTube className="h-4 w-4" />
            )}
            Test
          </Button>
        </div>

        {connectionStatus !== "idle" && (
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={cn(
                connectionStatus === "success" 
                  ? "bg-electric-green/20 text-electric-green border-electric-green/30"
                  : "bg-destructive/20 text-destructive border-destructive/30"
              )}
            >
              {connectionStatus === "success" ? "Connection Successful" : "Connection Failed"}
            </Badge>
          </div>
        )}

        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-md">
          <strong>⚠️ Security Notice:</strong> This configuration is stored in your browser's localStorage. 
          For production use, consider using Supabase integration for secure API key management.
        </div>
      </CardContent>
    </Card>
  );
}