import Fuse from "fuse.js";
import { Input } from "./ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function Search({
  data,
  setFiltered,
}: {
  data: any;
  setFiltered: any;
}) {
  const fuse = new Fuse(data, {
    includeScore: true,
    keys: ["shortpath", "destination"],
  });

  return (
    <div className="relative flex items-center grow">
      <Input
        placeholder="Search links"
        className="w-full"
        onChange={(e) => {
          if (!e.target.value) {
            setFiltered(data);
          } else {
            setFiltered(fuse.search(e.target.value).map((el) => el.item));
          }
        }}
      />
      <SearchIcon size={20} className="absolute right-2" />
    </div>
  );
}
