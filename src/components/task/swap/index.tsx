import {
	component$,
	useVisibleTask$,
	useStore,
	useContext,
	useSignal,
	$,
} from '@builder.io/qwik';
import { ethers } from 'ethers';
import { ERC20_ABI } from '~/abi/erc20.abi';
import { POOL_ABI } from '~/abi/pool.abi';
import { UserContext, modal } from '~/routes/task';

const LINK_ADDRESS = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
const WETH_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
const UNISWAP_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
const POOL_ADDRESS = '0xAB7591acEc3bE6f3709F77ed7951D0453D9ca095';

const walletProvider = modal?.getWalletProvider();

let provider: any = null;
if (walletProvider) {
	provider = new ethers.providers.Web3Provider(walletProvider);
} else {
	provider = new ethers.providers.JsonRpcProvider(
		'https://gateway.tenderly.co/public/goerli'
	);
}

const signer = provider.getSigner();

export default component$(() => {
	const user = useContext(UserContext);

	const tokenFrom = useSignal<string>(LINK_ADDRESS);
	const tokenTo = useSignal<string>(WETH_ADDRESS);
	const swapValue = useSignal<string>('');

	const userBalance = useStore({
		link: 0,
		weth: 0,
		uniswap: 0,
	});

	const getBalance = $(async (address: string): Promise<number> => {
		const tokenContract = new ethers.Contract(address, ERC20_ABI, signer);
		const decimals = await tokenContract.decimals();
		const balance = await tokenContract.balanceOf(user.address);
		return Number(ethers.utils.formatUnits(balance, decimals));
	});

	useVisibleTask$(async () => {
		if (user.isConnected) {
			userBalance.link = await getBalance(LINK_ADDRESS);
			userBalance.weth = await getBalance(WETH_ADDRESS);
			userBalance.uniswap = await getBalance(UNISWAP_ADDRESS);
		}
	});

	const swap = $(async () => {
		const swapContract = new ethers.Contract(
			POOL_ADDRESS,
			POOL_ABI,
			signer
		);

		console.log({
			tokenFrom: tokenFrom.value,
			tokenTo: tokenTo.value,
		});

		if (Number(swapValue.value) <= 0) {
			return;
		}

		const tokenFromContract = new ethers.Contract(
			tokenFrom.value,
			ERC20_ABI,
			signer
		);

		const decimals = await tokenFromContract.decimals();

		console.log({ decimals });

		const amount = BigInt(swapValue.value) * BigInt(10 ** decimals);

		console.log({ amount: amount.toString() });

		const approveTxHash = await tokenFromContract.approve(
			POOL_ADDRESS,
			amount
		);
		console.log({ approveTxHash });

		const receipt = await provider.waitForTransaction(approveTxHash.hash);

		console.log({ receipt });

		console.log({ tokenFrom, tokenTo, amount: amount.toString() });

		const returnedData = await swapContract.callstatic.swap(
			tokenFrom.value,
			tokenTo.value,
			amount.toString()
		);

		console.log({ returnedData });
	});

	return (
		<div class="flex flex-col gap-[24px]">
			<span>SWAP</span>
			<span>user weth balance: {userBalance.weth}</span>
			<span>user link balance: {userBalance.link}</span>
			<span>user uniswap balance: {userBalance.uniswap}</span>
			<div class="gap-[24px] flex flex-row">
				<div class="flex flex-col">
					<span>FROM</span>
					<select bind:value={tokenFrom} class="text-black w-[200px]">
						<option value={UNISWAP_ADDRESS}>UNISWAP</option>
						<option value={WETH_ADDRESS}>WETH</option>
						<option value={LINK_ADDRESS}>LINK</option>
					</select>
				</div>
				<div class="flex flex-col">
					<span>TO</span>
					<select bind:value={tokenTo} class="text-black w-[200px]">
						<option value={UNISWAP_ADDRESS}>UNISWAP</option>
						<option value={WETH_ADDRESS}>WETH</option>
						<option value={LINK_ADDRESS}>LINK</option>
					</select>
				</div>
				<div class="flex flex-col">
					<span>AMOUNT</span>
					<input
						bind:value={swapValue}
						type="number"
						class="text-black"
					/>
				</div>
				<button onClick$={swap}>SWAP</button>
			</div>
		</div>
	);
});
