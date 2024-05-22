import type { Subject } from "~/constants/subjects";

export interface HomeworkProps {
  title: string;
  description: string;
  dueDate: Date;
  subject: Subject;
  completedAt: Date | null;
  createdAt: Date;
  userId: string;
}

export class Homework {
  private readonly _id: string;
  private readonly props: HomeworkProps;

  constructor(props: HomeworkProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get dueDate() {
    return this.props.dueDate;
  }

  get subject() {
    return this.props.subject;
  }

  get completedAt() {
    return this.props.completedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get userId() {
    return this.props.userId;
  }
}
