import { registerTheme } from "@/cms";
import { ThemeManifest } from "@/cms/types";
import DefaultLayout from "./layouts/DefaultLayout";
import { HeroBlock, heroSchema } from "./blocks/Hero";
import { PostListBlock, postListSchema } from "./blocks/PostList";

const manifest: ThemeManifest = {
  id: "devpress",
  name: "DevPress",
  version: "0.1.0",
  assetsBasePath: "/themes/devpress",
  messages: {
    fa: {
      "hero.cta": "بزن بریم",
    },
    en: {
      "hero.cta": "Get Started",
    },
  },
  defaultLayout: "default",
  layouts: {
    default: {
      key: "default",
      slots: ["hero", "content"],
      Component: DefaultLayout,
    },
  },
  blocks: {
    "devpress.hero": {
      type: "devpress.hero",
      schema: heroSchema,
      Component: HeroBlock,
    },
    "devpress.postList": {
      type: "devpress.postList",
      schema: postListSchema,
      Component: PostListBlock,
    },
  },
};

registerTheme(manifest);

export default manifest;


