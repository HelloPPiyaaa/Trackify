import { createContext } from "react";
import type { User } from "./types";

export type UserAuthContextType = {
  userAuth: User;
  setUserAuth: React.Dispatch<React.SetStateAction<User>>;
};

export const UserContext = createContext<UserAuthContextType | undefined>(
  undefined
);
