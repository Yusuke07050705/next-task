export type MicroCmsPost = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  categories: { id: string; name: string }[];
  thumbnail: { url: string; height: number; width: number };
}