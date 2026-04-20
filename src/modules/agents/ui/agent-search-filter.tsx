import { Input } from "@/components/ui/input";
import { useAgentsFilters } from "../hooks/use-agent-filter";
import { SearchIcon, XCircle } from "lucide-react";
import { DEFAULT_PAGE } from "@/lib/constanst";
import { Button } from "@/components/ui/button";

export const AgentSearchFilter = () => {
  const [filter, setFilter] = useAgentsFilters();
  const isAnyFilterActive = !!filter.search;
  const onClearFilter = () => {
    setFilter({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <div className="relative ">
      <Input
        placeholder="Filter by name"
        className="h-9 bg-white w-50 pl-7 rounded-sm"
        value={filter.search}
        onChange={(e) => setFilter({ search: e.target.value })}
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      {isAnyFilterActive && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button onClick={onClearFilter} className="border-none">
            <XCircle className=" text-muted-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
};
