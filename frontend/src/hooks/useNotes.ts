import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../utils/api";
import { Note } from "../utils/types";

export function useNotes(search = "") {
  return useQuery<Note[]>(
    ["notes", search],
    async () => {
      const params = search ? { search } : {};
      const { data } = await api.get("/api/notes/", { params });
      return data;
    },
    { keepPreviousData: true }
  );
}

export function useNote(id: string) {
  return useQuery<Note>(
    ["note", id],
    async () => {
      const { data } = await api.get(`/api/notes/${id}/`);
      return data;
    },
    { enabled: !!id }
  );
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation(
    (payload: Partial<Note>) => api.post("/api/notes/", payload),
    { onSuccess: () => qc.invalidateQueries("notes") }
  );
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation(
    ({ id, ...payload }: Partial<Note> & { id: string }) =>
      api.patch(`/api/notes/${id}/`, payload),
    {
      onSuccess: (_, vars) => {
        qc.invalidateQueries("notes");
        qc.invalidateQueries(["note", vars.id]);
      },
    }
  );
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation(
    (id: string) => api.delete(`/api/notes/${id}/`),
    { onSuccess: () => qc.invalidateQueries("notes") }
  );
}

export function useShareNote() {
  const qc = useQueryClient();
  return useMutation(
    ({ id, email }: { id: string; email: string }) =>
      api.post(`/api/notes/${id}/share/`, { email }),
    { onSuccess: (_, vars) => qc.invalidateQueries(["note", vars.id]) }
  );
}
