import { useEffect } from "react";
import { NgineProvider } from "@ngine/core";
import ndk from "./ndk"

export const decorators = [
  (Story) => <NgineProvider ndk={ndk}><Story /></NgineProvider>
]
