import { useMemo, createElement } from "react";
import { NDKKind } from "@nostr-dev-kit/ndk";

import Note from "./Note";
import LongForm from "./LongForm";
import Reaction from "./Reaction";
import UnknownKind from "./UnknownKind";
import { EventProps, Components } from "../types";

const defaultComponents = {
  [NDKKind.Text]: Note,
  [NDKKind.Article]: LongForm,
  [NDKKind.Reaction]: Reaction,
  [NDKKind.Repost]: Reaction,
  [NDKKind.GenericRepost]: Reaction,
} as Components;

export default function Event({ event, components, ...props }: EventProps) {
  const component = useMemo(() => {
    if (components && components[event.kind as number]) {
      const element = components[event.kind as number];
      return createElement(element, {
        ...props,
        event,
        components,
      });
    }
    if (defaultComponents[event.kind as number]) {
      const element = defaultComponents[event.kind as number];
      return createElement(element, {
        ...props,
        event,
        components,
      });
    }
    return createElement(UnknownKind, {
      ...props,
      event,
      components,
    });
  }, [event, components]);
  return component;
}
