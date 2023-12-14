import { useToast, ToastPosition } from "@chakra-ui/react";

interface FeedbackParams {
  position?: ToastPosition;
  duration?: number;
  isClosable?: boolean;
}

interface Feedback {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
}

const defaultOptions = {
  position: "top-right" as ToastPosition,
  duration: 1500,
  isClosable: true,
};

export default function useFeedback(opts?: FeedbackParams): Feedback {
  const toast = useToast();
  const options = opts ? { ...defaultOptions, ...opts } : defaultOptions;

  return {
    success: (message: string, title?: string) => {
      toast({
        status: "success",
        title,
        description: message,
        ...options,
      });
    },
    error: (message: string, title?: string) => {
      toast({
        status: "error",
        title,
        description: message,
        ...options,
      });
    },
  };
}
