import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HomePage',
  setup() {
    const store = useStore();

    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const token = computed(() => store.getters.token);

    return {
      isLoggedIn,
      token,
    };
  },
};
