import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import {
  testAllConnections,
  validateConfig,
  type AppConfig,
  type ServiceConfig,
} from "@/lib/config";

interface ConnectionStatusProps {
  showDetails?: boolean;
  onStatusChange?: (config: AppConfig) => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  showDetails = true,
  onStatusChange,
}) => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTested, setLastTested] = useState<Date | null>(null);

  const testConnections = async () => {
    setIsLoading(true);
    try {
      const result = await testAllConnections();
      setConfig(result);
      setLastTested(new Date());
      onStatusChange?.(result);
    } catch (error) {
      console.error("Connection test failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnections();
  }, []);

  const getStatusIcon = (service: ServiceConfig) => {
    if (service.isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (service.isConfigured) {
      return <XCircle className="h-4 w-4 text-yellow-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (service: ServiceConfig) => {
    if (service.isConnected) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Connected
        </Badge>
      );
    }
    if (service.isConfigured) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Configured
        </Badge>
      );
    }
    return <Badge variant="destructive">Not Configured</Badge>;
  };

  const validation = validateConfig();

  if (!config) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Testing connections...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Service Connections</span>
            <Button
              variant="outline"
              size="sm"
              onClick={testConnections}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Test Connections</span>
            </Button>
          </CardTitle>
          {lastTested && (
            <p className="text-sm text-muted-foreground">
              Last tested: {lastTested.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {!validation.isValid && (
            <Alert className="mb-4">
              <AlertDescription>
                <strong>Configuration Issues:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries({
              Supabase: config.supabase,
              LiveKit: config.livekit,
              Tavus: config.tavus,
              Gemini: config.gemini,
              OpenAI: config.openai,
            }).map(([name, service]) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service)}
                  <div>
                    <p className="font-medium">{name}</p>
                    {showDetails && service.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {service.error}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(service)}
              </div>
            ))}
          </div>

          {showDetails && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Environment Information</h4>
              <div className="grid gap-2 text-sm">
                <div>
                  <span className="font-medium">App Name:</span>{" "}
                  {config.app.name}
                </div>
                <div>
                  <span className="font-medium">Environment:</span>{" "}
                  {config.app.environment}
                </div>
                <div>
                  <span className="font-medium">URL:</span> {config.app.url}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};