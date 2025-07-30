<template>
	<div class="x-ident mt-4">
		<div class="flex gap-4 items-center">
			<label class="text-2xl">Учетные записи</label>
			<button
				@click="addAccount"
				class="p-4 border rounded"
			>
				<v-icon>mdi-plus</v-icon>
			</button>
		</div>

		<v-alert
			icon="mdi-help-circle-outline"
			class="mt-4"
			color="#F0F8FF"
			text="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
		/>

		<v-data-table
			:headers="headers"
			:items="appStore.accounts as Account[]"
			item-value="id"
			class="mt-8"
			hide-default-footer
			no-data-text="Данных нету"
		>
			<template #item.label="{ item }">
				<v-text-field
					v-model="item.labelInput"
					:error="item.errors.label"
					@blur="() => onFieldChange(item, 'labelInput')"
					maxlength="50"
					variant="outlined"
					density="compact"
					hide-details
				/>
			</template>

			<template #item.type="{ item }">
				<v-select
					v-model="item.type"
					:items="TYPE_ACCOUNT"
					:error="item.errors.type"
					@update:model-value="() => onFieldChange(item, 'type')"
					variant="outlined"
					density="compact"
					hide-details
				/>
			</template>

			<template #item.login="{ item }">
				<v-text-field
					v-model="item.login"
					:error="item.errors.login"
					maxlength="100"
					@blur="() => onFieldChange(item, 'login')"
					variant="outlined"
					density="compact"
					hide-details
				/>
			</template>

			<template #item.password="{ item }">
				<v-text-field
					v-if="item.type === 'local'"
					v-model="item.password"
					:type="item.showPassword ? 'text' : 'password'"
					:append-inner-icon="item.showPassword ? 'mdi-eye-off' : 'mdi-eye'"
					@click:append-inner="item.showPassword = !item.showPassword"
					:error="item.errors.password"
					maxlength="100"
					@blur="() => onFieldChange(item, 'password')"
					variant="outlined"
					density="compact"
					hide-details
				/>
				<span
					v-else
					class="text-grey"
					>—</span
				>
			</template>

			<template #item.actions="{ item }">
				<v-icon
					class="cursor-pointer"
					@click="removeAccount(item.id)"
				>
					mdi-delete
				</v-icon>
			</template>
		</v-data-table>
	</div>
</template>

<script setup lang="ts">
	import { onMounted } from 'vue';
	import { Account, LOCAL_STORAGE_KEY, TYPE_ACCOUNT } from '@/entities';
	import { useAppStore } from '@/app/app.store';

	const appStore = useAppStore();

	const headers = [
		{ title: 'Метки', value: 'label' },
		{ title: 'Тип записи', value: 'type' },
		{ title: 'Логин', value: 'login' },
		{ title: 'Пароль', value: 'password' },
		{ title: '', value: 'actions', sortable: false }
	];

	function addAccount() {
		appStore.accounts.push({
			id: Date.now(),
			labelInput: '',
			label: [],
			type: 'local',
			login: '',
			password: '',
			showPassword: false,
			errors: {
				label: false,
				login: false,
				password: false,
				type: false
			}
		});
	}

	function removeAccount(id: number) {
		appStore.accounts = appStore.accounts.filter((acc) => acc.id !== id);
		saveAccounts();
	}

	function onFieldChange(item: Account, field: keyof Account) {
		if (field === 'labelInput') {
			item.label = item.labelInput
				.split(';')
				.map((s) => s.trim())
				.filter(Boolean)
				.map((text) => ({ text }));
		}

		if (field === 'type' && item.type === 'LDAP') {
			item.password = null;
		}

		validateAllFields(item);

		if (!hasErrors(item)) {
			saveAccounts();
		}
	}

	function validateAllFields(item: Account) {
		item.errors.label = item.labelInput.length > 50;
		item.errors.login = !item.login || item.login.length > 100;
		item.errors.password =
			item.type === 'local' && (!item.password || item.password.length > 100);
		item.errors.type = !item.type;
	}

	function hasErrors(item: Account) {
		return Object.values(item.errors).some(Boolean);
	}

	function saveAccounts() {
		const plain = appStore.accounts.map(({ errors, showPassword, ...rest }) => rest);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plain));
	}

	function loadAccounts() {
		const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (!raw) return;

		const parsed = JSON.parse(raw);
		appStore.accounts = parsed.map((acc: any): Account => ({
			...acc,
			labelInput: Array.isArray(acc.label)
				? acc.label.map((e: any) => e.text).join('; ')
				: '',
			password: acc.type === 'LDAP' ? null : (acc.password ?? ''),
			showPassword: false,
			errors: {
				label: false,
				login: false,
				password: false,
				type: false
			}
		}));
	}

	onMounted(loadAccounts);
</script>

<style scoped>
	.v-data-table .v-icon {
		cursor: pointer;
	}
</style>
