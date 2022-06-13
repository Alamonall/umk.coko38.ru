<template>
	<v-footer app outlined padless>
		<v-row justify="center" no-gutters>
			<v-btn
				v-for="link in links"
				:key="link.link"
				text
				rounded
				class="my-2"
				:href="link.link"
				target="_blank"
				link
			>
				<v-icon color="blue" size="24px">
					{{ link.icon }}
				</v-icon>
			</v-btn>
			<v-col class="py-4 text-center" cols="12">
				ГАУ ИО ЦОПМКиМКО © {{ new Date().getFullYear() }}
			</v-col>
		</v-row>
	</v-footer>
</template>
<script>
export default {
	data: () => ({
		links: [
			{
				name: 'Наш сайт',
				link: 'https://coko38.ru',
				icon: 'mdi-home-circle',
			},
			// {
			// 	name: 'ВКонтакте',
			// 	link: 'https://vk.com/public196012235',
			// 	icon: 'mdi-vk',
			// },
			// {
			// 	name: 'Facebook',
			// 	link: 'https://www.facebook.com/groups/249765916319275/',
			// 	icon: 'mdi-facebook',
			// },
			// {
			// 	name: 'Instagram',
			// 	link: 'https://www.instagram.com/copmkimko/?hl=ru',
			// 	icon: 'mdi-instagram',
			// },
		],
	}),
}
</script>
<style lang=""></style>
