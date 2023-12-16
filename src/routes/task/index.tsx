import {
	component$,
	$,
	useComputed$,
	useVisibleTask$,
	useStore,
	createContextId,
	useContextProvider,
} from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import WalletConnect from '~/components/task/wallet-connect';
import { ModalData } from '~/components/task/wallet-data';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5';
import Swap from '~/components/task/swap';

const projectId = import.meta.env.PUBLIC_WALLET_CONNECT_API_KEY;

const mainnet = {
	chainId: 1,
	name: 'Ethereum',
	currency: 'ETH',
	explorerUrl: 'https://etherscan.io',
	rpcUrl: 'https://cloudflare-eth.com',
};

const sepolia = {
	chainId: 11155111,
	name: 'Sepolia',
	currency: 'ETH',
	explorerUrl: 'https://sepolia.etherscan.io',
	rpcUrl: 'https://rpc.notadegen.com/eth/sepolia',
};

const goerli = {
	chainId: 5,
	name: 'Goerli',
	currency: 'ETH',
	explorerUrl: 'https://goerli.etherscan.io',
	rpcUrl: 'https://gateway.tenderly.co/public/goerli',
};

const metadata = {
	name: 'My Website',
	description: 'My Website description',
	url: 'https://mywebsite.com',
	icons: ['https://avatars.mywebsite.com/'],
};

export const modal = createWeb3Modal({
	ethersConfig: defaultConfig({ metadata }),
	chains: [mainnet, sepolia, goerli],
	projectId,
});

type TWalletStore = {
	networkId: number | undefined;
	address: string | undefined;
	isConnected: boolean;
};

export const UserContext = createContextId<TWalletStore>(
	'user.blockchain-data'
);

export default component$(() => {
	const wallet = useStore<TWalletStore>({
		networkId: undefined,
		address: undefined,
		isConnected: false,
	});

	const buttonText = useComputed$(() => {
		return wallet.isConnected
			? 'Open modal (You are connected)'
			: 'Connect Wallet';
	});

	const openModal$ = $(async () => {
		modal.open();
	});

	// eslint-disable-next-line qwik/no-use-visible-task
	useVisibleTask$(() => {
		// When page loads it assigns default values
		wallet.networkId = modal.getChainId();
		wallet.address = modal.getAddress();
		wallet.isConnected = modal.getIsConnected();

		// Listens for wallet changes
		modal.subscribeProvider((data) => {
			wallet.networkId = data.chainId;
			wallet.address = data.address;
			wallet.isConnected = data.isConnected;
		});
	});

	useContextProvider(UserContext, wallet);

	return (
		<div class="w-full h-[100vh] bg-black grid place-items-center">
			<WalletConnect openModal$={openModal$} text={buttonText} />
			<ModalData {...wallet} />
			{wallet.isConnected && <Swap />}
		</div>
	);
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
