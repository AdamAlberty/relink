"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./ui/use-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShortlinkDropdown } from "./shortlink-dropdown";

export default function Shortlink({
  link,
  setEditing,
}: {
  link: { domain: string; shortpath: string; destination: string };
  setEditing: Function;
}) {
  const queryClient = useQueryClient();

  // Delete link
  const linkDelete = useMutation({
    mutationKey: ["links"],
    mutationFn: (data: string) => {
      return fetch(`${localStorage.getItem("serverURL")}/api/links`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("apiKey")!,
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (res) => {
      if (!res.ok) {
        toast({
          title: "Failed to delete shortlink",
        });
        queryClient.invalidateQueries({ queryKey: ["links"] });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast({
        title: "Shortlink deleted successfully",
      });
    },
  });

  const handleDeleteLink = (short: string) => {
    linkDelete.mutate(short);
  };

  return (
    <li className="">
      <div
        className={cn(
          "py-2 md:py-4 border-b flex gap-5 justify-between items-center rounded-t-md"
        )}
      >
        <div className="">
          <div className="font-medium">
            <span className="text-muted-foreground">{link.domain}</span>/
            {link.shortpath}
          </div>
          <div className="text-sm text-muted-foreground">
            {link.destination}
          </div>
        </div>
        <div className="flex gap-2">
          <ShortlinkDropdown
            link={link}
            setEditing={setEditing}
            handleDeleteLink={handleDeleteLink}
          />
        </div>
      </div>
    </li>
  );
}
