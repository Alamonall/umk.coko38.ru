<template>
	<v-container
		v-if="
			isSignin && user.UserRole.code == 3 && emc.createdBy == user.id && emc.isCustom
			/* Дополнительно проверяем: не убрал ли возможность ред-ть умк (isCustom) и создатель данного умк совпадает ли с данным пользователем*/
		"
		class="px-0"
		fluid
	>
		<v-card v-if="emc == null">
			<v-card-title class="text-h4 text-center"> Идёт загрузка данных... </v-card-title>
		</v-card>
		<v-card v-if="emc != null">
			<v-card-title class="text-h4"> Редактирование УМК </v-card-title>
			<v-card-text class="text-h5">
				<v-text-field v-model="emc.title" label="Название"></v-text-field>
				<v-text-field label="Авторы" :value="emc.authors"></v-text-field>
				<v-text-field v-model="emc.grades" label="Класс"></v-text-field>
				<v-select
					v-model="emc.Subject"
					:items="subjects"
					item-text="name"
					no-data-text="Нет данных"
					label="Предмет"
					return-object
				></v-select>
				<v-select
					v-model="emc.Level"
					:items="levels"
					item-text="name"
					no-data-text="Нет данных"
					label="Уровень"
					return-object
				></v-select>
				<v-select
					v-model="emc.Publisher"
					:items="publishers"
					item-text="name"
					label="Издательство"
					no-data-text="Нет данных"
					return-object
				></v-select>
			</v-card-text>
			<v-card-actions>
				<v-btn text color="teal accent-4" @click="saveEMC"> Сохранить изменения </v-btn>
				<v-spacer></v-spacer>
				<v-btn text color="red accent-2" :to="{ name: 'poo-emcs' }">
					Отменить редактирование
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>
<script>
import { mapState } from 'vuex'

export default {
	data: () => ({
		loading: false,
		error: null,
		message: null,
		emc: {
			title: null,
			grades: null,
			gia: null,
			Subject: null,
			publisherId: null,
			Publisher: null,
			isCustom: null,
			levelId: null,
			Level: null,
		},
	}),
	computed: {
		...mapState(['publishers', 'levels', 'user', 'subjects', 'isSignin', 'emcs']),
	},
	created() {
		this.$store.dispatch('setAreasSidebar', false)
		this.$store.dispatch('setSubjectsSidebar', false)
	},
	async mounted() {
		try {
			this.emc = this.$store.state.emcs.filter((emc) => emc.id === this.$route.params.emcId)
		} catch (err) {
			this.error = err
		}
	},
	methods: {
		async saveEMC() {
			try {
				this.$set(
					this.emc,
					'publisherId',
					this.$store.state.publishers.find((x) => x.id === this.emc.Publisher.id).id,
				)
				this.$set(
					this.emc,
					'subjectId',
					this.$store.state.subjects.find((x) => x.code === this.emc.Subject.code).id,
				)
				this.$set(
					this.emc,
					'levelId',
					this.$store.state.levels.find((x) => x.id === this.emc.Level.id).id,
				)
				this.$store.dispatch('updateEMC', this.emc)
				this.$router.push({ name: 'poo-emcs' })
			} catch (error) {
				this.error = error
			}
		},
	},
}
</script>
<style scope></style>
