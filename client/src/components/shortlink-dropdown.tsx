import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  EllipsisVertical,
  Pen,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { toast } from "./ui/use-toast";
import { TLink } from "@/lib/types";

export function ShortlinkDropdown({
  link,
  setEditing,
  handleDeleteLink,
}: {
  link: TLink;
  setEditing: Function;
  handleDeleteLink: Function;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-2 px-3">
          <EllipsisVertical size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 grid gap-1">
        <Button
          onClick={async () => {
            await navigator.clipboard.writeText(
              `${link.domain}/${link.shortpath}`
            );
            toast({
              title: "Link copied to clipboard",
              description: `${link.domain}/${link.shortpath}`,
            });
          }}
          variant="outline"
          className="w-full flex gap-2 justify-start text-left"
        >
          <Copy size={15} />
          <span>Copy shortlink</span>
        </Button>

        <Button
          onClick={() => setEditing(link)}
          className="w-full flex gap-2 justify-start text-left"
          variant="outline"
        >
          <Pen size={15} />
          <span>Edit</span>
        </Button>
        <Button
          onClick={() => handleDeleteLink(link.id)}
          className="w-full flex gap-2 justify-start text-left"
          variant="destructive"
        >
          <Trash size={15} />
          <span>Delete</span>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
