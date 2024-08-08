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

export function ShortlinkDropdown({
  link,
  setEditing,
  handleDeleteLink,
}: {
  link: any;
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
              `${localStorage.getItem("serverURL")}/${link.short}`
            );
            toast({
              title: "Link copied to clipboard",
              description: `${localStorage.getItem("serverURL")}/${link.short}`,
            });
          }}
          variant="outline"
          className="w-full flex gap-2 justify-start text-left"
        >
          <Copy size={15} />
          <span>Copy shortlink</span>
        </Button>

        <Button
          onClick={() => setEditing({ ...link, shortOld: link.short })}
          className="w-full flex gap-2 justify-start text-left"
          variant="outline"
        >
          <Pen size={15} />
          <span>Edit</span>
        </Button>
        <Button
          onClick={() => handleDeleteLink(link.short)}
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
