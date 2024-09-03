import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GenerateShortlink from "@/components/GenerateShortlink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Link } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

// Link schema
const schema = z
  .object({
    shortpath: z
      .string()
      .min(1, "Must be filled")
      .max(100, "Too long shortpath, max is 100"),
    destination: z.string().url("Must be a valid url"),
    domain: z.string().min(1, "Must be filled"),
  })
  .required();

export default function EditShortlink({
  editing,
  setEditing,
}: {
  editing: Link | null;
  setEditing: Dispatch<SetStateAction<Link | null>>;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      domain: "",
      shortpath: "",
      destination: "",
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (editing) {
      setValue("domain", editing.domain);
      setValue("shortpath", editing.shortpath);
      setValue("destination", editing.destination);
    }
  }, [editing]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: any) => {
      return fetch("/_api/links", {
        method: "PUT",
        body: JSON.stringify({ ...payload, id: editing!.id }),
      });
    },
    onSuccess(res) {
      if (!res.ok) {
        toast({
          title: "Could not edit shortlink",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Shortlink edited successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      setEditing(null);
    },
  });

  const handleEditLink = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
      <DialogContent>
        <section className="grid gap-5">
          <DialogTitle className="text-lg mb-5 font-medium">
            Edit shortlink
          </DialogTitle>
          <div className="grid gap-3">
            <Label htmlFor="domain">Shortener domain</Label>
            <div>
              <Input
                autoComplete="off"
                type="text"
                id="domain"
                className={cn({ "rounded-b-none": errors.domain?.message })}
                {...register("domain")}
              />
              {errors.domain?.message && (
                <div className="bg-red-500 p-2 rounded-b-md text-sm">
                  {errors.domain.message}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="short">Shortpath</Label>
            <div>
              <div className="relative">
                <Input
                  autoComplete="off"
                  type="text"
                  id="short"
                  className={cn({
                    "rounded-b-none": errors.shortpath?.message,
                  })}
                  {...register("shortpath")}
                />
                <div className="absolute right-0 top-0">
                  <GenerateShortlink
                    onGenerate={(v: string) => setValue("shortpath", v)}
                  />
                </div>
              </div>
              {errors.shortpath?.message && (
                <div className="bg-red-500 p-2 rounded-b-md text-sm">
                  {errors.shortpath.message}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="destination">Destination URL</Label>
            <div>
              <Input
                autoComplete="off"
                type="text"
                id="destination"
                className={cn({
                  "rounded-b-none": errors.destination?.message,
                })}
                {...register("destination")}
              />

              {errors.destination?.message && (
                <div className="bg-red-500 p-2 rounded-b-md text-sm">
                  {errors.destination.message}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit((v) => handleEditLink(v))}
            className="w-full mt-5"
          >
            Edit shortlink
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
}
