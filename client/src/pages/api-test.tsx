import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

export default function ApiTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-openai');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          type: 'FetchError'
        }
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">OpenAI API Diagnostics</h1>
        <p className="text-muted-foreground">
          Test the OpenAI API connection and troubleshoot issues
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
          <CardDescription>
            This will make a minimal test call to OpenAI to verify the connection is working
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runTest} 
            disabled={testing}
            className="w-full"
            data-testid="button-test-api"
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run API Test
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className={result.success ? "border-green-500" : "border-red-500"}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <CardTitle>
                {result.success ? "Test Passed ✓" : "Test Failed ✗"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <Badge variant={result.success ? "default" : "destructive"}>
                {result.testCallStatus || 'Unknown'}
              </Badge>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Configuration</h3>
              <div className="space-y-1 text-sm font-mono">
                <div>
                  <span className="text-muted-foreground">Environment:</span>{" "}
                  <span className="font-semibold">{result.environment || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">API Key Configured:</span>{" "}
                  <Badge variant={result.apiKeyConfigured ? "default" : "destructive"}>
                    {result.apiKeyConfigured ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {result.apiKeyPrefix && (
                  <div>
                    <span className="text-muted-foreground">API Key Prefix:</span>{" "}
                    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                      {result.apiKeyPrefix}...
                    </code>
                  </div>
                )}
                {result.apiKeyLength && (
                  <div>
                    <span className="text-muted-foreground">API Key Length:</span>{" "}
                    <span className="font-semibold">{result.apiKeyLength}</span>
                  </div>
                )}
              </div>
            </div>

            {result.details && Object.keys(result.details).length > 0 && (
              <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-green-900 dark:text-green-100">
                  Success Details
                </h3>
                <div className="space-y-1 text-sm font-mono">
                  <div>
                    <span className="text-muted-foreground">Model:</span>{" "}
                    <span className="font-semibold">{result.details.model}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response:</span>{" "}
                    <span className="font-semibold">{result.details.response}</span>
                  </div>
                  {result.details.usage && (
                    <div>
                      <span className="text-muted-foreground">Tokens Used:</span>{" "}
                      <span className="font-semibold">
                        {result.details.usage.total_tokens || 'N/A'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.error && (
              <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-red-900 dark:text-red-100">
                  Error Details
                </h3>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-900 rounded p-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Message:</span>
                      <pre className="mt-1 text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
                        {result.error.message}
                      </pre>
                    </div>
                  </div>
                  
                  {result.error.type && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Error Type:</span>{" "}
                      <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                        {result.error.type}
                      </code>
                    </div>
                  )}
                  
                  {result.error.status && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Status Code:</span>{" "}
                      <Badge variant="destructive">{result.error.status}</Badge>
                    </div>
                  )}
                  
                  {result.error.code && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Error Code:</span>{" "}
                      <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                        {result.error.code}
                      </code>
                    </div>
                  )}

                  {result.error.stack && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Stack Trace:</span>
                      <pre className="mt-1 text-xs bg-white dark:bg-gray-900 p-2 rounded overflow-x-auto">
                        {result.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                Troubleshooting Tips
              </h3>
              <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                {!result.apiKeyConfigured && (
                  <li>• Add OPENAI_API_KEY to your deployment secrets</li>
                )}
                {result.error?.message?.includes('disabled') && (
                  <>
                    <li>• Check Replit deployment settings for API restrictions</li>
                    <li>• Ensure "Node API" or outbound network access is enabled</li>
                    <li>• Try redeploying with updated environment configuration</li>
                  </>
                )}
                {result.error?.status === 401 && (
                  <li>• Verify your OpenAI API key is valid and active</li>
                )}
                {result.error?.status === 429 && (
                  <li>• OpenAI rate limit exceeded - wait a few moments and retry</li>
                )}
                {result.error?.message?.includes('quota') && (
                  <li>• Check your OpenAI account has sufficient credits</li>
                )}
              </ul>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Full Response</h3>
              <pre className="text-xs bg-white dark:bg-gray-950 p-3 rounded overflow-x-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
