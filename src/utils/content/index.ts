import type {
  IPost,
  IRawPost,
  PostPathDateFormat,
  GroupedPosts,
} from "./types";
import { convert, createPostFromRaw } from "./_helpers";

/**
 returns an array of data for a series of pages for posts -
 each item is the path params and an array of posts (as props)
*/
export function groupPostsByPath(
  sortedPosts: IPost[],
  format: PostPathDateFormat
): GroupedPosts[] {
  const data = sortedPosts.reduce<{ [path: string]: IPost[] }>((acc, post) => {
    const { yyyy, mm, dd } = post.path;
    const key = convert({ yyyy, mm, dd }, format) as string;
    let posts = acc[key];
    if (!posts) {
      posts = acc[key] = [];
    }
    posts.push(post);
    return acc;
  }, {});

  const arr = Object.entries(data).map(([key, posts]) => {
    const { yyyy, mm, dd } = convert(key) as {
      yyyy: string;
      mm?: string;
      dd?: string;
    };
    return {
      params: { yyyy, mm, dd },
      props: { posts },
    };
  });
  return arr;
}

interface IGetPostsOptions {
  limit?: number;
  sortOrder?: "asc" | "desc";
}

/** 
 returns an array of posts, sorted by (descending as default) date
*/
export function createPostsFromRaw(
  rawPosts: IRawPost[],
  options: Partial<IGetPostsOptions> = {}
): IPost[] {
  options = {
    ...{
      limit: rawPosts.length,
      sortOrder: "desc",
    },
    ...options,
  };
  const posts: IPost[] = rawPosts.map(createPostFromRaw);
  const sortOrderFactor = "desc" === options.sortOrder ? 1 : -1;
  posts.sort((post1, post2) => {
    const { date: date1 } = post1.data;
    const { date: date2 } = post2.data;

    if (date1 > date2) {
      return -1 * sortOrderFactor;
    }
    if (date1 < date2) {
      return 1 * sortOrderFactor;
    }
    const { time: time1 } = post1.data;
    const { time: time2 } = post2.data;
    if (time1 > time2) {
      return -1 * sortOrderFactor;
    }
    if (time1 < time2) {
      return 1 * sortOrderFactor;
    }
    return 0;
  });
  return posts.slice(0, options.limit);
}

type CandidateConfiguratorOptions = {
  yyyy: string;
  mm: string;
  dd: string;
};
type CandidateProps = {
  path: string;
  label: string;
  token: string;
};
type CandidateConfigurator = (
  options: CandidateConfiguratorOptions
) => CandidateProps;

export interface IPartitionedSection extends CandidateProps {
  posts: IPost[];
}

/**
 Returns an array of sections, where each item as
 - path: string, post's path
 - label: string, "leaf" of post's path as a display name
 - token: string, "leaf" of post's path as a token
 - posts: IPost[]

 The `getCandidate` function is sent in as a parameter from the call site,
 and decides exactly what data to extract from the path params yyyy, mm, dd
 */
export function partitionBySection(
  posts: IPost[],
  getCandidate: CandidateConfigurator
): IPartitionedSection[] {
  const sections = posts.reduce((acc, post) => {
    const { yyyy, mm, dd } = post.path;
    const candidate = getCandidate({ yyyy, mm, dd });
    let target = acc[acc.length - 1]; // the latest section started
    if (!target || target.token !== candidate.token) {
      // need to start a new section for token
      target = { ...candidate, posts: [] };
      acc.push(target);
    }
    target.posts.push(post);
    return acc;
  }, []);
  return sections;
}
