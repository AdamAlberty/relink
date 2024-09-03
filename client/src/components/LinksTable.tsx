import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Pen, TriangleAlert } from "lucide-react";
import DeleteShortlink from "./DeleteShortlink";
import { Link } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function LinksTable({
  setEditing,
}: {
  setEditing: Dispatch<SetStateAction<Link | null>>;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      const res = await fetch("/_api/links");
      if (!res.ok) {
        throw new Error("");
      }
      return (await res.json()) as Link[];
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Domain</TableHead>
            <TableHead>Shortpath</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            data &&
            data.map((link) => (
              <TableRow>
                <TableCell className="font-medium">{link.domain}</TableCell>
                <TableCell>{link.shortpath}</TableCell>
                <TableCell>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {link.destination.length > 50
                            ? link.destination.slice(0, 50) + "..."
                            : link.destination}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{link.destination}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className="">
                  <div className="flex gap-3 items-center justify-end">
                    <button onClick={() => setEditing(link)} className="">
                      <Pen size={18} />
                    </button>
                    <DeleteShortlink link={link} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {isLoading && (
        <div>
          {new Array(10).fill(0).map(() => (
            <div className="h-12 odd:bg-muted animate-pulse"></div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex justify-center items-center flex-col mt-10">
          <TriangleAlert size={40} className="text-red-500" />
          <div className="mt-5 font-medium">API Error</div>
          <p className="mt-2 text-muted-foreground">Could not load links</p>
        </div>
      )}
    </>
  );
}
