import Emoji from "../components/Emoji";
import { Fragment, Tags } from "../types";

export function extractCustomEmoji(
  fragments: Fragment[],
  tags: Tags,
  boxSize = 5,
) {
  return fragments
    .map((f) => {
      if (typeof f === "string") {
        return f.split(/:(\w+):/g).map((i) => {
          const t = tags.find((a) => a[0] === "emoji" && a[1] === i);
          if (t) {
            return (
              <Emoji
                borderRadius="none"
                display="inline"
                fit="contain"
                alt={t[1]}
                src={t[2]}
                boxSize={boxSize}
              />
            );
          } else {
            return i;
          }
        });
      }
      return f;
    })
    .flat();
}
