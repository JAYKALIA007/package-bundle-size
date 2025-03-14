"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PackageResults from "@/components/package-results";

export default function Home() {
  const [packageName, setPackageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [packageData, setPackageData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/bundle-size?package=${encodeURIComponent(packageName)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch package data");
      }

      const data = await response.json();
      setPackageData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setPackageData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          NPM Bundle Size Analyzer
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Analyze the real impact of npm packages on your application bundle
          size, not just the unpacked size listed on npm.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Check Package Bundle Size</CardTitle>
          <CardDescription>
            Enter an npm package name to see its impact on your bundle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center space-x-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Package name (e.g., react, lodash, @mui/material)"
                className="pl-8"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <p>{error}</p> */}
            <p className="text-sm text-muted-foreground">
              This could be due to an invalid package name or network issues.
              Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {packageData && <PackageResults data={packageData} />}
    </main>
  );
}
