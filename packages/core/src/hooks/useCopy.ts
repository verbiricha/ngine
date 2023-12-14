export default function useCopy() {
  const copy = async (text: string) => {
    if (typeof navigator === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(text);
  };

  return copy;
}
