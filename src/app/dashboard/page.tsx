'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateProfile } from '@/services/api';
import { saveGeneratedProfile } from './actions';
import { CheckCircle, XCircle, CircleNotch } from '@phosphor-icons/react/dist/ssr';

interface BatchInput {
  url: string;
  user_type: string;
  email?: string;
}

interface BatchResult {
  url: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  message?: string;
  email?: string;
}

export default function DashboardPage() {
  const [jsonInput, setJsonInput] = useState('[\n  { "url": "https://example.com/portfolio", "user_type": "Photographer", "email": "creator@example.com" }\n]');
  const [results, setResults] = useState<BatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartBatch = async () => {
    try {
      const parsed: BatchInput[] = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("Input must be a JSON array");
      
      const initialResults = parsed.map(item => ({
        url: item.url,
        email: item.email,
        status: 'pending' as const
      }));
      setResults(initialResults);
      setIsProcessing(true);

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        
        // Update status to processing
        setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'processing' } : r));

        try {
          // 1. Generate profile from Python AI backend
          const generatedData = await generateProfile({ url: item.url, user_type: item.user_type });
          
          // 2. Save to Supabase (and handle email invite logic in action)
          const saveResult = await saveGeneratedProfile({
            ...generatedData,
            source_url: item.url,
            email: item.email
          });

          if (saveResult.error) {
            throw new Error(saveResult.error);
          }

          // Update status to success
          setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'success' } : r));
        } catch (error: any) {
          // Update status to error
          setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'error', message: error.message } : r));
        }
      }
    } catch (e: any) {
      alert("Invalid JSON format: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Internal Dashboard</h1>
          <p className="text-muted-foreground mt-2">Batch import and generate profiles for rising talent.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Batch Profile Generator</CardTitle>
            <CardDescription>
              Provide a JSON array containing objects with <code className="bg-muted px-1 py-0.5 rounded">url</code>, <code className="bg-muted px-1 py-0.5 rounded">user_type</code>, and an optional <code className="bg-muted px-1 py-0.5 rounded">email</code> to invite them later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="font-mono h-64 bg-zinc-950"
              placeholder="Paste JSON array here..."
            />
            <Button 
              onClick={handleStartBatch} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing Batch..." : "Start Batch Import"}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Import Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((result, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium truncate">{result.url}</span>
                      {result.email && <span className="text-xs text-muted-foreground">Invite: {result.email}</span>}
                      {result.message && <span className="text-sm text-destructive mt-1">{result.message}</span>}
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {result.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
                      {result.status === 'processing' && <CircleNotch className="animate-spin text-emerald-500 w-6 h-6" />}
                      {result.status === 'success' && <CheckCircle className="text-emerald-500 w-6 h-6" weight="fill" />}
                      {result.status === 'error' && <XCircle className="text-destructive w-6 h-6" weight="fill" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
