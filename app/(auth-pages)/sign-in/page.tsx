import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex items-center flex-col gap-5 justify-center">
      <Card className="w-full max-w-md border-none">
        <form action={signInAction}>
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-primary font-medium underline"
              >
                Sign up
              </Link>
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                required
              />
            </div>

            <FormMessage message={searchParams} />
          </CardContent>

          <CardFooter>
            <SubmitButton
              pendingText="Signing in..."
              formAction={signInAction}
              className="w-full"
            >
              Sign In
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>

      <SmtpMessage />
    </div>
  );
}
