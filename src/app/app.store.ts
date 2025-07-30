import { ref, } from 'vue';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
    const auth = ref(false);

    return {
        auth,
    };
});
