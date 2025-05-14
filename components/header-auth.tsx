import { signOutAction, getUserProfile } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import Navbar from "./navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, UserIcon } from "lucide-react";

export default async function AuthButton() {
  const supabase = await createClient();

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <Button
          asChild
          size="sm"
          variant={"outline"}
          disabled
          className="opacity-75 cursor-none pointer-events-none"
        >
          <Link href="/sign-in">Join With us</Link>
        </Button>
      </div>
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm">
          <Link href="/sign-in">Join Exams</Link>
        </Button>
      </div>
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm">
          <Link href="/sign-in">Join Exams</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <Navbar />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full">
              <UserIcon size={25} className="h-8 w-8" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile.full_name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOutAction}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
