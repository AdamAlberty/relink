import AddShortlink from "@/components/AddShortlink";
import LinksTable from "@/components/LinksTable";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [isAddingShortlink, setIsAddingShortlink] = useState(false);

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

      {isAddingShortlink && (
        <section className="mt-10">
          <AddShortlink />
        </section>
      )}

      <section className="mt-10">
        <LinksTable />
      </section>
    </main>
  );
}
