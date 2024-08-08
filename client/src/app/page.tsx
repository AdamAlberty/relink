"use client";

import Shortlink from "@/components/shortlink";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LogOut, Plus, Server } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoImg from "./icon.png";
import { getShortlinks, verifyConnection } from "@/lib/actions";
import Search from "@/components/search";
import ImportExport from "@/components/import-export";
import { ShortlinkEditDialog } from "@/components/shortlink-edit";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [editing, setEditing] = useState<{
    short: string;
    long: string;
    shortOld: string;
  } | null>(null);

  // Verify connection
  useEffect(() => {
    verifyConnection()
      .then((res) => {
        if (!res.ok) {
          router.push("/config");
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast({ title: "Could not verify connection" });
        router.push("/config");
      });
  }, [router]);

  // Get active shortlinks
  const links = useQuery({
    queryKey: ["links"],
    queryFn: getShortlinks,
    enabled: !isLoading,
  });

  useEffect(() => {
    if (!links.data) {
      return;
    }
    setFiltered(links.data);
  }, [links.data]);

  if (isLoading || !links.data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 size={30} className="animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-screen-lg mx-auto p-8 md:pt-[5vh] mb-20">
      <div className="flex justify-between items-center mb-14">
        <Link href="/" className="flex items-center gap-2">
          <Image src={LogoImg} alt="" className="w-8 h-8 md:w-10 md:h-10" />
          <h1 className="text-lg md:text-3xl font-medium ">Relink</h1>
        </Link>

        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/create" className="gap-2">
              <Plus size={18} />
              Add new
            </Link>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => {
              localStorage.clear();
              toast({
                title: "Disconnected successfully",
                description: "Secrets were removed from local storage",
              });
              router.push("/config");
            }}
          >
            <LogOut size={18} />
            <span className="sr-only">Disconnect</span>
          </Button>
        </div>
      </div>

      <section className="flex gap-5 justify-between items-center">
        <Search data={links.data} setFiltered={setFiltered} />
        <ImportExport />
      </section>
      <ul className="grid mt-5">
        {filtered &&
          filtered.map((link: any) => (
            <Shortlink key={link.short} link={link} setEditing={setEditing} />
          ))}
      </ul>

      {links.data.length > 0 && filtered.length === 0 && (
        <div className="text-center mt-14">Link not found</div>
      )}

      <div className="mt-10 text-center text-muted-foreground text-sm">
        {links.data.length > 0 && `${links.data.length} links total`}
      </div>

      {links.data && links.data.length === 0 && (
        <div className="text-center mt-14">
          There aren&apos;t any shortlinks yet. Add one.
        </div>
      )}

      <div className="fixed flex p-2 justify-center bottom-0 left-0 right-0 gap-2 items-center">
        <div className="flex items-center gap-3 p-2 px-3 rounded-full text-muted-foreground bg-background/50 backdrop-blur">
          <Server size={18} />
          <span className="text-sm">{localStorage.getItem("serverURL")}</span>
        </div>
      </div>

      <ShortlinkEditDialog editing={editing} setEditing={setEditing} />
    </main>
  );
}
