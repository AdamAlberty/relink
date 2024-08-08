import { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Create new shortlink | Relink Admin",
};

export default function CreatePage() {
  return <Client />;
}
