import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { appConfig, testAllConnections, ServiceConfig } from "@/lib/config";
import { useAuthStore } from "@/store/authStore";

interface TestResult {
  success: boolean;
  message: string;
  data?: unknown;
}

export default function ConnectionTestPage() {
  const [config, setConfig] = useState(appConfig);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>(
    {}
  );
  const [loginEmail, setLoginEmail] = useState("test@example.com");
  const [loginPassword, setLoginPassword] = useState("testpassword123");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { user, isAuthenticated, login, signup } = useAuthStore();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);

    let loginErrorObj: unknown = undefined;
    try {
      await login(loginEmail, loginPassword);
    } catch (error) {
      loginErrorObj = error;
      // If login fails, try to sign up
      try {
        await signup(loginEmail, loginPassword);
      } catch {
        setLoginError(
          loginErrorObj instanceof Error
            ? loginErrorObj.message
            : "Login failed"
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleTestConnections = async () => {
    setIsTesting(true);
    setTestResults({});

    try {
      const results = await testAllConnections();
      setConfig(results);

      // Store individual test results
      const resultsMap: Record<string, TestResult> = {};
      Object.entries(results).forEach(([key, value]) => {
        if (key !== "app") {
          resultsMap[key] = {
            success: value.isConnected,
            message: value.error || "Connection successful",
            data: value,
          };
        }
      });
      setTestResults(resultsMap);
    } catch (error) {
      console.error("Connection test failed:", error);
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (isConnected: boolean, isLoading: boolean) => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    return isConnected ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (service: ServiceConfig) => {
    if (service.isConnected) {
      return (
        <Badge variant="default" className="bg-green-500">
          Connected
        </Badge>
      );
    } else if (service.isConfigured) {
      return <Badge variant="secondary">Configured</Badge>;
    } else {
      return <Badge variant="destructive">Not Configured</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Connection Test Dashboard</h1>
        <p className="text-muted-foreground">
          Test all your service connections and verify your environment setup.
        </p>
      </div>

      {/* Authentication Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Authentication Required
          </CardTitle>
          <CardDescription>
            You need to be logged in to test LiveKit and other authenticated
            services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Logged in as: {user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  User ID: {user?.id}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="testpassword123"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login / Sign Up"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Button */}
      <div className="mb-6">
        <Button
          onClick={handleTestConnections}
          disabled={isTesting || !isAuthenticated}
          size="lg"
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connections...
            </>
          ) : (
            "Test All Connections"
          )}
        </Button>
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(config).map(([key, service]) => {
          if (key === "app") return null;

          const testResult = testResults[key];
          const isLoading = isTesting && !testResult;

          return (
            <Card key={key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(service.isConnected, isLoading)}
                    {service.name}
                  </CardTitle>
                  {getStatusBadge(service)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Configured:</span>
                    <span
                      className={
                        service.isConfigured ? "text-green-600" : "text-red-600"
                      }
                    >
                      {service.isConfigured ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Connected:</span>
                    <span
                      className={
                        service.isConnected ? "text-green-600" : "text-red-600"
                      }
                    >
                      {service.isConnected ? "Yes" : "No"}
                    </span>
                  </div>
                  {service.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-xs">
                        {service.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Environment Info */}
      <div className="my-8 border-t pt-8"></div>
      <Card>
        <CardHeader>
          <CardTitle>Environment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">App Name:</span> {config.app.name}
            </div>
            <div>
              <span className="font-medium">Environment:</span>{" "}
              {config.app.environment}
            </div>
            <div>
              <span className="font-medium">URL:</span> {config.app.url}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
