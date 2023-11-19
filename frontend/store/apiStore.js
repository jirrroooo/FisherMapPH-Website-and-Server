import { create } from 'zustand'

export const useApiStore = create((set) => ({
  apiUrl: "http://localhost:3001/",
  // apiUrl: "https://glorious-succotash-rw54xg77pwvcxxvg-3001.app.github.dev/",
}))
