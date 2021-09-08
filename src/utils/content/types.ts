export interface IAstroMarkdownParams {
  yyyy: string;
  mm?: string;
  dd?: string;
  slug?: string;
}
export interface IRawPost extends IFrontMatter {
  astro: IAstroMarkdownProps;
  url: boolean;
  file: URL;
  params: IAstroMarkdownParams;
}
export interface IPost {
  // from raw read
  source: string;
  html: string;
  dirName: string;
  // computed and organized
  excerpt: string;
  path: {
    full: string;
    yyyy: string;
    mm: string;
    dd: string;
    slug: string;
  };
  data: Required<IFrontMatter> & {
    date: string;
  };
}

interface IAstroMarkdownProps {
  headers: Array<{ depth?: number; slug?: string; text?: string }>;
  source: string;
  html: string;
}

interface IFrontMatter {
  title: string;
  keywords?: string[];
  time?: string;
  useComments?: boolean;
}

export type PostPathDateFormat = "yyyy/mm/dd" | "yyyy/mm" | "yyyy";

export type GroupedPosts = {
  params: IAstroMarkdownParams;
  props: { posts: IPost[] };
};
