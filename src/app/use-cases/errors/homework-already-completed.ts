export class HomeworkAlreadyCompletedError extends Error {
  constructor() {
    super("Homework already completed");
  }
}
