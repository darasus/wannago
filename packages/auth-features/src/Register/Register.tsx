"use client";

import { useAuth, useSignUp } from "@clerk/nextjs";
import { ClerkAPIError } from "@clerk/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { CardBase, LoadingBlock, Button, Text } from "ui";
import { cn, sleep } from "utils";
import { Input } from "../../../../apps/web/src/components/Input/Input/Input";
import { titleFont } from "../../../../apps/web/src/fonts";

interface CodeForm {
  code: string;
}

interface UserInfoForm {
  email: string;
  firstName: string;
  lastName: string;
}

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
  const userInfoForm = useForm<UserInfoForm>();
  const codeForm = useForm<CodeForm>({ mode: "onSubmit" });

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
  const form = useFormContext<UserInfoForm>();

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
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="First name"
            {...form.register("firstName", {
              required: {
                value: true,
                message: "First name is required",
              },
            })}
            error={form.formState.errors.firstName}
            autoComplete="given-name"
            data-testid="register-first-name-input"
          />
          <Input
            type="text"
            label="Last name"
            {...form.register("lastName", {
              required: {
                value: true,
                message: "Last name is required",
              },
            })}
            error={form.formState.errors.lastName}
            autoComplete="family-name"
            data-testid="register-last-name-input"
          />
        </div>
        <Input
          type="email"
          label="Email"
          {...form.register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
          })}
          error={form.formState.errors.email}
          autoComplete="email"
          data-testid="register-email-input"
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
  );
}

interface CodeFormProps {
  email: string;
  onDone: (createdSessionId: string) => Promise<void>;
}

function CodeForm({ onDone, email }: CodeFormProps) {
  const { signUp } = useSignUp();
  const form = useFormContext<CodeForm>();
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
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          description={`Enter the code sent to ${email}`}
          label="Code"
          {...form.register("code", {
            validate: (value) => {
              try {
                if (!value) return "Code is required";

                if (typeof value === "string") {
                  const length = value.length;
                  if (length > 6 || length < 6) {
                    return "Code must be 6 characters long";
                  }
                }
                const n = Number(value);

                if (typeof n === "number" && !isNaN(n)) {
                  return true;
                } else {
                  return "Code must be a number";
                }
              } catch (error) {
                return "Code must be a number";
              }
            },
          })}
          error={form.formState.errors.code}
          autoComplete="off"
          data-testid="register-code-input"
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
