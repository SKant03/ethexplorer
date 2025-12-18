import Link from "next/link";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/blocks");
}
