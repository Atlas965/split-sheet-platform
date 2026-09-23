import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FolderOpen, Database, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { matchesSearchText } from "@shared/dashboard-ops";

interface SearchItem {
  id: string;
  title: string;
  type: string;
  status?: string | null;
  description?: string | null;
  url: string;
  updatedAt?: string | null;
  createdAt?: string | null;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery<{ results: SearchItem[] }>({
    queryKey: ["/api/search", searchTerm],
    queryFn: async () => {
      const query = searchTerm.trim();
      const url = query ? `/api/search?q=${encodeURIComponent(query)}` : "/api/search";
      return await apiRequest("GET", url);
    },
  });

  const results = useMemo(() => {
    const items = Array.isArray(data?.results) ? data.results : [];
    const query = searchTerm.trim();
    if (!query) return items;
    return items.filter((item) => matchesSearchText(query, item));
  }, [data, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Global Search</h1>
        <p className="text-muted-foreground mt-2">
          Search projects, split sheets, and rights-ledger records across your workspace.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search workspace
          </CardTitle>
          <CardDescription>
            Search by title, status, type, or asset name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, splits, or ledger assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="w-fit">
                      {item.type === "rights-ledger" ? "Rights ledger" : "Project"}
                    </Badge>
                    <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
                  </div>
                  {item.status && <Badge variant="outline">{String(item.status).replace(/[_-]/g, " ")}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.description || "Operational record"}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "Recent"}</span>
                  <Link href={item.url} className="inline-flex items-center gap-1 text-primary hover:underline">
                    Open
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-card">
          <div className="flex items-center justify-center gap-3 text-muted-foreground mb-3">
            <FolderOpen className="h-8 w-8" />
            <Database className="h-8 w-8" />
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No results</h3>
          <p className="text-muted-foreground">
            Try a broader query like “pending”, “artist”, or a project title.
          </p>
        </div>
      )}
    </div>
  );
}
