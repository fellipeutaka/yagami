import type { Homework } from "~/app/entities/homework";
import type {
  HomeworkPaginateProps,
  HomeworksRepository,
} from "../homeworks-repository";

export class InMemoryHomeworksRepository implements HomeworksRepository {
  public items: Homework[] = [];

  async findById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }
  async paginate(props: HomeworkPaginateProps) {
    const { lastCursor, perPage } = props;

    const startIndex = lastCursor
      ? this.items.findIndex((item) => item.id === lastCursor) + 1
      : 0;

    const data = this.items.slice(startIndex, startIndex + perPage);

    const lastItem = data[data.length - 1];
    const lastCursorValue = lastItem ? lastItem.id : null;

    const hasNextPage = this.items.length > startIndex + perPage;

    return {
      data,
      meta: {
        lastCursor: lastCursorValue,
        hasNextPage,
      },
    };
  }

  async create(data: Homework) {
    this.items.push(data);
  }

  async update(homework: Homework) {
    const index = this.items.findIndex((item) => item.id === homework.id);
    this.items[index] = homework;
  }

  async delete(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
