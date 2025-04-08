
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { API_KEY_STORAGE_KEY } from "@/config/constants";
import { toast } from "sonner";

interface ApiKeyFormProps {
  onKeySubmit: (key: string) => void;
  initialKey: string;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onKeySubmit, initialKey }) => {
  const [apiKey, setApiKey] = useState<string>(initialKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || apiKey.trim().length < 10) {
      toast.error("Please enter a valid API key");
      return;
    }

    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    onKeySubmit(apiKey);
    toast.success("API key saved successfully!");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lanka-blue">Gemini API Key</CardTitle>
        <CardDescription>
          Enter your Gemini API key to enable the educational counselor.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                To use this counselor, you need a Gemini API key from Google AI Studio.
              </p>
              <a 
                href="https://ai.google.dev/tutorials/setup" 
                target="_blank" 
                rel="noreferrer noopener" 
                className="text-lanka-blue hover:underline text-sm flex items-center gap-1"
              >
                Get your API key here
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="feather feather-external-link"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
            <Input
              type="password"
              placeholder="Paste your Gemini API key here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-lanka-blue hover:bg-lanka-dark">
            Save API Key
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ApiKeyForm;
