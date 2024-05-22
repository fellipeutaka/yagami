export interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export class User {
  private readonly _id: string;
  private readonly props: UserProps;

  constructor(props: UserProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
