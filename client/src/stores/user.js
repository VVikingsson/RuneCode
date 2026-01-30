import { defineStore } from 'pinia';
import { Api } from '@/Api';

export const useUserStore = defineStore('user', {
  state: () => ({ // state = schema
    user: null, // user obj
    loggedIn: false,
    loading: true,
    avatarUrl: null
  }),

  actions: { // actions = methods
    async restoreSession() {
      this.loading = true;

      try {
        const res = await Api.get('users/auth/me');
        this.user = res.data.user;
        // added to put the picture in the global store
        this.avatarUrl = res.data.user?.url || null
        this.loggedIn = true;
      } catch (err) {
        this.user = null;
        this.loggedIn = false;
      }

      this.loading = false;
    },

    setUser(userData) {
      this.user = userData;
      this.loggedIn = true;
    },

    setAvatar(url) {
      this.avatarUrl = `${url}?t=${Date.now()}`
    },

    logout() {
      this.user = null;
      this.loggedIn = false;
    }
  },
});
