import type { Homework } from "../entities/homework";

export interface HomeworkPaginateProps {
  lastCursor?: string | null;
  perPage: number;
  userId: string;
}

export interface HomeworksRepository {
  findById(id: string): Promise<Homework | null>;
  paginate(props: HomeworkPaginateProps): Promise<{
    data: Homework[];
    meta: {
      lastCursor: string | null;
      hasNextPage: boolean;
    };
  }>;
  create(data: Homework): Promise<void>;
  update(homework: Homework): Promise<void>;
  delete(id: string): Promise<void>;
}
