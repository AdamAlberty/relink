import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";
import { toast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Import() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleImport = async () => {
    if (!fileInputRef.current || !fileInputRef.current.files) {
      return;
    }

    const fd = new FormData();
    fd.append("import", fileInputRef.current.files[0]);

    const res = await fetch("/_api/import", { method: "POST", body: fd });
    if (res.ok) {
      toast({
        title: "Links imported successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["links"] });
    } else {
      toast({
        title: "Error importing links",
      });
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          if (!fileInputRef.current) {
            return;
          }
          fileInputRef.current.click();
        }}
        className="gap-2"
        size="sm"
        variant="ghost"
      >
        <ArrowUp size={18} />
        Import links
      </Button>
      <input
        ref={fileInputRef}
        onChange={handleImport}
        type="file"
        accept="application/json"
        className="hidden"
      />
    </div>
  );
}
