import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Pen } from "lucide-react";
import DeleteShortlink from "./DeleteShortlink";
import { Link } from "@/lib/types";

export default function LinksTable() {
  const { data } = useQuery({
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
        {data &&
          data.map((link) => (
            <TableRow>
              <TableCell className="font-medium">{link.domain}</TableCell>
              <TableCell>{link.shortpath}</TableCell>
              <TableCell>{link.destination}</TableCell>
              <TableCell className="">
                <div className="flex gap-3 items-center justify-end">
                  <button className="">
                    <Pen size={18} />
                  </button>
                  <DeleteShortlink link={link} />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
