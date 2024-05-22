import type { Homework } from "../entities/homework";

export interface HomeworksRepository {
  findById(id: string): Promise<Homework | null>;
  findMany(): Promise<Homework[]>;
  create(data: Homework): Promise<void>;
  update(homework: Homework): Promise<void>;
  delete(id: string): Promise<void>;
}
