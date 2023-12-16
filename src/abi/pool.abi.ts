export const POOL_ABI = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'poolFee',
		outputs: [
			{
				internalType: 'uint24',
				name: '',
				type: 'uint24',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'tokenIn',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'tokenOut',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'swap',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amountOut',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'swapRouter',
		outputs: [
			{
				internalType: 'contract ISwapRouter',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
];
