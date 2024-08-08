import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import GenerateShortlink from "./generate-shortlink";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./ui/use-toast";
import { useEffect } from "react";

export function ShortlinkEditDialog({
  editing,
  setEditing,
}: {
  editing: any;
  setEditing: Function;
}) {
  const queryClient = useQueryClient();

  const linkUpdate = useMutation({
    mutationFn: (payload) => {
      return fetch(`${localStorage.getItem("serverURL")}/api/links`, {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("apiKey")!,
        },
        body: JSON.stringify(payload),
      });
    },
    onSuccess(res) {
      if (!res.ok) {
        toast({
          title: "Could not update shortlink",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Shortlink updated successfully",
      });
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  const handleUpdateLink = (values: any) => {
    linkUpdate.mutate({ ...values, shortOld: editing.shortOld });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      short: "",
      long: "",
    },
  });

  useEffect(() => {
    if (editing) {
      setValue("short", editing.short);
      setValue("long", editing.long);
    }
  }, [editing]);

  return (
    <Dialog
      open={editing}
      onOpenChange={(open) => {
        if (!open) {
          setEditing(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Shortlink</DialogTitle>
        </DialogHeader>
        <div className="">
          <div className="">
            <div>
              <Label htmlFor="short">Short link</Label>
              <div>
                <div className="relative">
                  <Input
                    autoComplete="off"
                    type="text"
                    id="short"
                    {...register("short")}
                  />
                  <div className="absolute right-0 top-0">
                    <GenerateShortlink
                      onGenerate={(v: string) => setValue("short", v)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="long">Destination URL</Label>
              <Input
                type="text"
                id="long"
                placeholder="https://example.com/page"
                {...register("long")}
              />
            </div>
            <Button
              onClick={handleSubmit((v) => handleUpdateLink(v))}
              className="w-full mt-5"
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
