import AddShortlink from "@/components/AddShortlink";
import EditShortlink from "@/components/EditShortlink";
import Export from "@/components/Export";
import Import from "@/components/Import";
import LinksTable from "@/components/LinksTable";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/types";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [isAddingShortlink, setIsAddingShortlink] = useState(false);
  const [editing, setEditing] = useState<Link | null>(null);

  return (
    <main className="max-w-screen-lg mx-auto p-8 md:pt-[5vh] mb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium">Relink</h1>
        <Button
          onClick={() => setIsAddingShortlink(!isAddingShortlink)}
          variant={isAddingShortlink ? "destructive" : "default"}
          className="gap-2"
        >
          {isAddingShortlink ? (
            <>
              <X size={18} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={18} />
              Add shortlink
            </>
          )}
        </Button>
      </div>

      {/* When adding shortlink */}
      {isAddingShortlink && (
        <section className="mt-10">
          <AddShortlink setIsAddingShortlink={setIsAddingShortlink} />
        </section>
      )}

      {/* List of shortlinks */}
      <section className="mt-10">
        <LinksTable setEditing={setEditing} />
      </section>

      <EditShortlink editing={editing} setEditing={setEditing} />

      <section className="flex justify-center items-center gap-2 mt-20">
        <Import />
        <Export />
      </section>
    </main>
  );
}
