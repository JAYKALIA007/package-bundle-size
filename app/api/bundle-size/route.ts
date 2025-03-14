import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageName = searchParams.get("package");

  if (!packageName) {
    return NextResponse.json(
      { error: "Package name is required" },
      { status: 400 }
    );
  }

  try {
    // Use the Bundlephobia API to get the bundle size information
    const response = await fetch(
      `https://bundlephobia.com/api/size?package=${encodeURIComponent(
        packageName
      )}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch package data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      name: data.name,
      version: data.version,
      description: data.description,
      size: data.size,
      gzip: data.gzip,
      dependencyCount: data.dependencyCount,
      hasJSModule: data.hasJSModule,
      hasJSNext: data.hasJSNext,
      hasSideEffects: data.hasSideEffects,
      repository: data.repository?.url?.replace(/^git\+|\.git$/g, "") || null,
      scoped: data.scoped,
    });
  } catch (error) {
    console.error("Error fetching package data:", error);
    return NextResponse.json(
      { error: "Failed to fetch package data" },
      { status: 500 }
    );
  }
}
