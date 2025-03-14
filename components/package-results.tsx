import { FileDown, ExternalLink, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PackageResultsProps {
  data: {
    name: string;
    version: string;
    description?: string;
    size: number;
    gzip: number;
    dependencyCount: number;
    hasJSModule: boolean;
    hasJSNext: boolean;
    hasSideEffects: boolean;
    repository?: string;
    scoped?: boolean;
  };
}

export default function PackageResults({ data }: PackageResultsProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  const getSizeImpact = (bytes: number) => {
    if (bytes < 10000) return "minimal";
    if (bytes < 50000) return "small";
    if (bytes < 100000) return "moderate";
    if (bytes < 250000) return "significant";
    return "large";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "minimal":
        return "bg-green-500/10 text-green-500";
      case "small":
        return "bg-blue-500/10 text-blue-500";
      case "moderate":
        return "bg-yellow-500/10 text-yellow-500";
      case "significant":
        return "bg-orange-500/10 text-orange-500";
      case "large":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const sizeImpact = getSizeImpact(data.size);
  const impactColor = getImpactColor(sizeImpact);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {data.name}
              <span className="text-sm font-normal text-muted-foreground">
                v{data.version}
              </span>
            </CardTitle>
            {data.description && (
              <CardDescription className="mt-2">
                {data.description}
              </CardDescription>
            )}
          </div>
          <Badge variant="outline" className={impactColor}>
            {sizeImpact} impact
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Minified Size
            </h3>
            <p className="text-2xl font-bold">{formatSize(data.size)}</p>
            <p className="text-sm text-muted-foreground">
              Size after minification, before gzipping
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Minified + Gzipped
            </h3>
            <p className="text-2xl font-bold">{formatSize(data.gzip)}</p>
            <p className="text-sm text-muted-foreground">
              Size after minification and gzip compression
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Dependencies</h3>
            <p>{data.dependencyCount}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">ES Module</h3>
            <p>{data.hasJSModule ? "Yes" : "No"}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Side Effects</h3>
            <p>{data.hasSideEffects ? "Yes" : "No"}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://npmjs.com/package/${data.name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            NPM
          </a>
        </Button>
        {data.repository && (
          <Button variant="outline" size="sm" asChild>
            <a href={data.repository} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Repository
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://bundlephobia.com/package/${data.name}@${data.version}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Full Report
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
