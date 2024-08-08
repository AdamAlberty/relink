"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const mutation = useMutation({
    mutationFn: (payload: { serverURL: string; apiKey: string }) => {
      return fetch(`${payload.serverURL}/api/verify`, {
        method: "POST",
        headers: {
          Authorization: payload.apiKey,
        },
      });
    },

    onError: (data, variables) => {
      toast({
        title: "Failed to establish connection with server",
        description: "Check if you have the correct server url and API key",
        variant: "destructive",
      });
    },

    onSuccess: (data, variables) => {
      if (!data.ok) {
        toast({
          title: "Failed to establish connection with server",
          description: "Check if you have the correct server url and API key",
          variant: "destructive",
        });
        return;
      }
      localStorage.setItem("serverURL", variables.serverURL);
      localStorage.setItem("apiKey", variables.apiKey);
      toast({
        title: "Connection verified successfully",
      });
      router.push("/");
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serverURL: "",
      apiKey: "",
    },
  });

  const handleVerifyConnection = (values: any) => {
    mutation.mutate(values);
  };

  useEffect(() => {
    setValue("serverURL", localStorage.getItem("serverURL") || "");
    setValue("apiKey", localStorage.getItem("apiKey") || "");
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
    <main className="max-w-screen-lg mx-auto p-8 pt-[20vh]">
      <div className="flex justify-between mb-10">
        <h2 className="text-3xl font-medium text-balance">
          Connect to Relink server
        </h2>
      </div>

      <form className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="serverURL">Server url</Label>
          <div>
            <Input
              autoComplete="off"
              type="text"
              id="serverURL"
              {...register("serverURL")}
              placeholder="https://relink.com"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="apiKey">API key</Label>
          <Input
            autoComplete="off"
            type="password"
            id="apiKey"
            placeholder=""
            {...register("apiKey")}
          />
        </div>
        <Button
          type="submit"
          onClick={handleSubmit((v) => handleVerifyConnection(v))}
          className="w-full mt-5"
        >
          Try to connect
        </Button>
      </form>
    </main>
  );
}
