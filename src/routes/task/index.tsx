import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
	return <div class="w-full h-[100vh] bg-black"></div>;
});

export const head: DocumentHead = {
	title: 'Task',
	meta: [
		{
			name: 'description',
			content: 'Task site description',
		},
	],
};
