export interface User {
  access_token: string | null;
  _id?: string;
  username?: string;
  fullname?: string;
  profile_picture?: string;
}

export interface Project {
  _id: string;
  name: string;
  des: string;
  startDate?: string;
  endDate?: string;
}

export interface Issue {
  _id: string;
  title: string;
  status: "Open" | "InProgress" | "Done";
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
}
