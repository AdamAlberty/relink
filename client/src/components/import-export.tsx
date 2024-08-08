import { exportShortlinks, importShortlinks } from "@/lib/actions";
import { Button } from "./ui/button";
import { Import } from "lucide-react";

export default function ImportExport() {
  const handleImport = (e: any) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const fd = new FormData();
    fd.append("csv", file);
    importShortlinks(fd);
  };

  const handleExport = () => {
    exportShortlinks();
  };

  return (
    <div className="flex gap-2">
      <div>
        <Button
          size="sm"
          variant="secondary"
          className="gap-2 cursor-pointer"
          asChild
        >
          <label htmlFor="import">
            <Import size={18} />
            Import
          </label>
        </Button>
        <input
          onChange={handleImport}
          id="import"
          type="file"
          className="hidden"
        />
      </div>

      <div>
        <Button
          onClick={handleExport}
          size="sm"
          variant="secondary"
          className="gap-2 cursor-pointer"
        >
          <Import className="rotate-180" size={18} />
          Export
        </Button>
      </div>
    </div>
  );
}
