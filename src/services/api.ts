import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get<User[]>("/users");
      return data;
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: Omit<User, "id">) => {
      const { data } = await api.post<User>("/users", userData);
      return data;
    },
  });
};
