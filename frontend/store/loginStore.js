import { create } from 'zustand'

export const useLoginStore = create((set) => ({
  isLoggedIn: false,
  authToken: "",
}))
