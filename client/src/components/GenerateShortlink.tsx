import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";

export default function GenerateShortlink({
  onGenerate,
}: {
  onGenerate: Function;
}) {
  return (
    <Button
      variant="secondary"
      className="gap-2 rounded-l-none"
      onClick={() => onGenerate((Math.random() + 1).toString(36).substring(7))}
    >
      <Dices size={18} />
      Random
    </Button>
  );
}
