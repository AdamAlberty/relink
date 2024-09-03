import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

export default function Export() {
  const handleExport = () => {
    const link = document.createElement("a");
    link.href = "/_api/export";
    link.download = "export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Button
        onClick={handleExport}
        className="gap-2"
        size="sm"
        variant="ghost"
      >
        <ArrowDown size={18} />
        Export links
      </Button>
    </div>
  );
}
