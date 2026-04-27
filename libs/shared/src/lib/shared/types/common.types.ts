export type Pageable<T> = {
  items: T[];
  page: number;
  pages: number;
  size: number;
  total: number;
};
