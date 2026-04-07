
import { SignUpForm } from "@/modules/sign-up/ui/SignUp";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-md bg-[#2D5169] font-semibold text-primary-foreground">
              <Image src="/img/logo.png" alt="logo" width={50} height={50} />
            </div>
            Mecal AI.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/img/background.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Page;
