"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export function useLoadingToast({
  isLoading,
  text,
}: {
  isLoading: boolean;
  text?: string;
}) {
  useEffect(() => {
    let toastId: string | undefined;
    if (isLoading) {
      toastId = toast.loading("Loading...");
    } else {
      toast.dismiss(toastId);
      toastId = undefined;
    }
  }, [isLoading]);
}
