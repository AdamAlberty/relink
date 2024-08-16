"use client";

import GenerateShortlink from "@/components/generate-shortlink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { createShortlink } from "@/lib/actions";
import { useMutation } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    shortpath: z
      .string()
      .min(1, "Must contain something")
      .max(50, "Shortlink is too long"),
    destination: z.string().url("Must be a valid url"),
    domain: z.string().min(1, "Must contain something"),
  })
  .required();

export default function Client() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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

  const mutation = useMutation({
    mutationFn: (payload: { short: string; long: string }) => {
      return createShortlink(payload);
    },
    onSuccess(res) {
      if (!res.ok) {
        toast({
          title: "Could not create shortlink",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Shortlink created successfully",
      });
      router.push("/");
    },
  });

  const handleCreateLink = (values: any) => {
    mutation.mutate(values);
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 size={30} className="animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-screen-lg mx-auto p-8 pt-[10vh]">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-medium text-balance">
          Create new short link
        </h2>
        <Button asChild variant="outline" className="w-10 h-10 p-0">
          <Link href="/">
            <X />
          </Link>
        </Button>
      </div>

      <section className="grid gap-5">
        <div>
          <Label htmlFor="long">Shortener domain</Label>
          <Input
            autoComplete="off"
            type="text"
            id="long"
            placeholder="go.example.com"
            {...register("domain")}
          />
        </div>

        <div>
          <Label htmlFor="short">Shortpath</Label>
          <div>
            <div className="relative">
              <Input
                autoComplete="off"
                type="text"
                id="short"
                {...register("shortpath")}
              />
              <div className="absolute right-0 top-0">
                <GenerateShortlink
                  onGenerate={(v: string) => setValue("shortpath", v)}
                />
              </div>
            </div>
            {errors.shortpath?.message && (
              <div className="bg-red-500 mt-2 p-2 rounded-md text-sm">
                {errors.shortpath.message}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="destination">Destination URL</Label>
          <Input
            autoComplete="off"
            type="text"
            id="destination"
            placeholder="https://example.com/page"
            {...register("destination")}
          />

          {errors.destination?.message && (
            <div className="bg-red-500 mt-2 p-2 rounded-md text-sm">
              {errors.destination.message}
            </div>
          )}
        </div>
      </section>
      <Button
        onClick={handleSubmit((v) => handleCreateLink(v))}
        className="w-full mt-5"
      >
        Create
      </Button>
    </main>
  );
}
