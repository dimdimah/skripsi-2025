import { signInAction, signInWithGoogleAction } from "@/app/actions";
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

export default async function SignIn(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  const showMessage = "message" in searchParams;

  return (
    <div className="flex items-center flex-col gap-2 justify-center">
      <Card className="w-full max-w-md border-none shadow-none">
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

            {showMessage && <FormMessage message={searchParams} />}
          </CardContent>

          <CardFooter className="pb-0">
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
      <p className="text-center text-xs text-muted-foreground my-3">OR</p>
      <Card className="w-full max-w-md border-none shadow-none">
        <form action={signInWithGoogleAction}>
          <CardFooter>
            <SubmitButton
              formAction={signInWithGoogleAction}
              pendingText="Signing in..."
              className="w-full"
              variant="outline"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign In with Google
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>

      <SmtpMessage />
    </div>
  );
}
