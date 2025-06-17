import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <Card className="bg-red-100 border-4 border-red-500">
        <CardHeader>
          <CardTitle className="text-red-800">🔥 CACHE TEST PAGE</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold text-red-800">
            This is a brand new test page created at {new Date().toLocaleString()}
          </p>
          <p className="text-red-700 mt-2">
            If you see this page, frontend updates are working correctly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}