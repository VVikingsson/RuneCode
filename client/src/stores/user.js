import { defineStore } from 'pinia';
import { Api } from '@/Api';

export const useUserStore = defineStore('user', {
  state: () => ({ // state = schema
    user: null, // user obj
    loggedIn: false,
    loading: true, 
  }),

  actions: { // actions = methods
    async restoreSession() {
      this.loading = true;

      try {
        const res = await Api.get('users/auth/me');
        console.log(res);
        this.user = res.data.user;
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

    logout() {
      this.user = null;
      this.loggedIn = false;
    }
  },
});
