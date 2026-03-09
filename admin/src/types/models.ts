/**
 * Local type definitions mirroring the API models.
 * These avoid cross-project imports from the api/ directory.
 */

export interface IUser {
  _id?: string;
  name?: string;
  email: string;
  password?: string;
  level?: number;
}

export interface ISection {
  _id?: string;
  image?: string;
  imageDescription?: string;
  title?: string;
  text: string;
  nr: number;
  created?: Date;
}

export interface IArticle {
  _id?: string;
  published: boolean;
  material: "REPORT" | "PROJECT";
  image?: string;
  title: string;
  subheader?: string;
  tags?: string[];
  mainPoints?: string[] | string;
  content: ISection[];
  created?: Date;
}

export interface IDonor {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  status: "CREATED" | "PENDING DONATION" | "PENDING CONFIRMATION" | "DONE";
  project?: IArticle;
  option?: number;
}
