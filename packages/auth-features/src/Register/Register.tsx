"use client";

import { useAuth, useSignUp } from "@clerk/nextjs";
import { ClerkAPIError } from "@clerk/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import {
  CardBase,
  LoadingBlock,
  Button,
  Text,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
} from "ui";
import { cn, sleep } from "utils";
import { titleFont } from "../../../../apps/web/src/fonts";
import { z } from "zod";

const codeFormScheme = z.object({
  code: z.string().length(6),
});

const infoFormScheme = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

export interface APIResponseError {
  errors: ClerkAPIError[];
}

interface Props {
  onDone?: () => void;
  onLoginClick?: () => void;
}

export function Register({ onDone, onLoginClick }: Props) {
  const { setSession, isLoaded } = useSignUp();
  const { getToken } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"user_info" | "code">("user_info");
  const userInfoForm = useForm<z.infer<typeof infoFormScheme>>();
  const codeForm = useForm<z.infer<typeof codeFormScheme>>({
    mode: "onSubmit",
  });

  const ready = useCallback(async (): Promise<any> => {
    const token = await getToken();

    if (!token) {
      await sleep(1000);
      return ready();
    }
  }, [getToken]);

  const handleOnDone = async (createdSessionId: string): Promise<any> => {
    await setSession?.(createdSessionId);
    await ready();

    if (onDone) {
      onDone?.();
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleLoginClick = useCallback(() => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push("/login");
    }
  }, [router, onLoginClick]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Text className={cn("text-4xl", titleFont.className)}>
        Create account
      </Text>
      <CardBase className="w-full">
        {isLoaded ? (
          <>
            {step === "user_info" && (
              <FormProvider {...userInfoForm}>
                <UserForm goToNextStep={() => setStep("code")} />
              </FormProvider>
            )}
            {step === "code" && (
              <FormProvider {...codeForm}>
                <CodeForm
                  onDone={handleOnDone}
                  email={userInfoForm.watch("email")}
                />
              </FormProvider>
            )}
          </>
        ) : (
          <LoadingBlock />
        )}
      </CardBase>
      <Text className="text-center">- OR -</Text>
      <Button onClick={handleLoginClick} variant="outline">
        Login
      </Button>
    </div>
  );
}

interface UserFormProps {
  goToNextStep: () => void;
}

function UserForm({ goToNextStep }: UserFormProps) {
  const { signUp } = useSignUp();
  const form = useFormContext<z.infer<typeof infoFormScheme>>();

  const submit = form.handleSubmit(async (data) => {
    try {
      const signUpAttempt = await signUp?.create({
        emailAddress: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await signUpAttempt?.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      goToNextStep();
    } catch (error: any) {
      const e = error as APIResponseError;

      if (e.errors[0].meta?.paramName === "email_address") {
        form.setError("email", {
          type: "manual",
          message: parseError(e),
        });
      }
    }
  });

  useEffect(() => {
    form.setFocus("firstName");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={submit}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="register-first-name-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="register-last-name-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="email"
                    data-testid="register-email-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
            data-testid="register-user-info-form-submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface CodeFormProps {
  email: string;
  onDone: (createdSessionId: string) => Promise<void>;
}

function CodeForm({ onDone, email }: CodeFormProps) {
  const { signUp } = useSignUp();
  const form = useFormContext<z.infer<typeof codeFormScheme>>();
  const code = form.watch("code");

  const submit = form.handleSubmit(async (data) => {
    try {
      const signUpAttempt = await signUp?.attemptEmailAddressVerification({
        code: data.code,
      });

      if (
        signUpAttempt?.verifications.emailAddress.status === "verified" &&
        signUpAttempt.status === "complete" &&
        signUpAttempt.createdSessionId
      ) {
        await onDone(signUpAttempt.createdSessionId);
      }
    } catch (error: any) {
      form.setError("code", {
        type: "manual",
        message: parseError(error as APIResponseError),
      });
    }
  });

  useEffect(() => {
    form.setFocus("code");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (code?.length === 6) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <Form {...form}>
      <form onSubmit={submit}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    data-testid="register-code-input"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
            data-testid="register-code-form-submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function parseError(err: APIResponseError): string {
  if (!err) {
    return "";
  }

  if (err.errors) {
    return err.errors[0].longMessage || "";
  }

  throw err;
}
