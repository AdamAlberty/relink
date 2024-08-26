import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "@/lib/types";
import { Trash } from "lucide-react";
import { toast } from "./ui/use-toast";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

export default function DeleteShortlink({ link }: { link: Link }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash className="text-red-400" size={18} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete shortlink?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>
              {link.domain}/{link.shortpath}
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                const res = await fetch("/_api/links", {
                  method: "DELETE",
                  body: JSON.stringify(link.id),
                });
                if (res.ok) {
                  toast({ title: (await res.json()).message });
                } else {
                  toast({
                    title: (await res.json()).message,
                    variant: "destructive",
                  });
                }
              } catch (err) {
                toast({ title: "Unknown err", variant: "destructive" });
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
