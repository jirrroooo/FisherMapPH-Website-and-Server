import { create } from 'zustand'

export const useLoginStore = create((set) => ({
  isLoggedIn: false,
  isVerifiedCookie: false,
  token: ""
}))
