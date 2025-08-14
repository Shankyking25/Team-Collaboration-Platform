export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  teamId?: string;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  members?: User[];
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  assignedTo?: string;
}

export interface Message {
  _id: string;
  sender: string;
  text: string;
  createdAt: string;
}
