import { create } from 'zustand'

export const useApiStore = create((set) => ({
  apiUrl: "http://localhost:3001/",
}))
