import { ref, } from 'vue';
import { defineStore } from 'pinia';
import { Account } from '@/entities';

export const useAppStore = defineStore('app', () => {
    const accounts = ref<Account[]>([]);

    return {
        accounts,
    };
});
