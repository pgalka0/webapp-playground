import { QRL, Signal, component$ } from '@builder.io/qwik';

type WalletConnectButonProps = {
	openModal$: QRL<() => void>;
	text: Signal<string>;
};

export default component$<WalletConnectButonProps>(({ openModal$, text }) => {
	return <button onClick$={() => openModal$()}>{text}</button>;
});
