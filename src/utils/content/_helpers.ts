import removeMarkdown from "remove-markdown";
import { IPost, IRawPost, PostPathDateFormat } from "./types";

interface IPostMetaData {
  path: string;
  yyyy: string;
  mm: string;
  dd: string;
  slug: string;
}

/**
 Extract data from a raw post (currentöy just using its filename) 
*/
export function getMetaData(post: IRawPost): IPostMetaData {
  const expr =
    /content\/posts\/(?<date>(?<yyyy>\d{4})-(?<mm>\d{2})-(?<dd>\d{2}))_(?<slug>.+)\//;
  const { groups: params } = expr.exec(post.file.pathname) || {};
  const { yyyy, mm, dd, slug } = params;
  const path = `/posts/${yyyy}/${mm}/${dd}/${slug}`;
  return { yyyy, mm, dd, slug, path };
}

/**
 convert a date value ("yyyy/mm/dd" string - or an object!)
 into a new object which contains only those parts of the date
 which are included in the given `format`
 */
export function convert(
  value: string | { yyyy: string; mm?: string; dd?: string },
  format?: PostPathDateFormat
) {
  const separator = "/";
  if ("string" == typeof value) {
    const parts = value.split(separator);
    const props = ["yyyy", "mm", "dd"];
    return parts.reduce((acc, part, idx) => {
      acc[props[idx]] = part;
      return acc;
    }, {});
  }

  return Object.entries(value)
    .filter(([key]) => format.includes(key))
    .map(([, value]) => value)
    .join(separator);
}

/**
 Builds a nice, full-fledged Post object from some raw post data.
 A good time to populate the business object with all bells and
 whistles one might have use for later on.
 */
export function createPostFromRaw(rawPost: IRawPost): IPost {
  const { source, html } = rawPost.astro;
  const excerpt = getExcerpt(source);
  const data = getMetaData(rawPost);
  return {
    source,
    html,
    dirName: rawPost.file.pathname.split("/").slice(0, -1).join("/"),
    excerpt,
    path: {
      full: data.path,
      yyyy: data.yyyy,
      mm: data.mm,
      dd: data.dd,
      slug: data.slug,
    },
    data: {
      title: rawPost.title,
      date: `${data.yyyy}-${data.mm}-${data.dd}`,
      time: rawPost.time || "",
      keywords: rawPost.keywords || [],
      useComments: rawPost.useComments || false,
    },
  };
}

function getExcerpt(markdown: string, maxLength = 60) {
  const contentText = removeMarkdown(markdown).trim().replace(/\s+/g, " ");
  const excerpt = contentText.slice(0, maxLength);
  if (contentText.length > maxLength) {
    return `${excerpt}...`;
  }
  return excerpt;
}
