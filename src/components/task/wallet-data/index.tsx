import { type TWalletStore } from '~/routes/task';
import { type Optional } from 'utility-types';

type TModalDataProps = Optional<TWalletStore, 'isConnected'>;

export const ModalData = ({ networkId, address }: TModalDataProps) => {
	return (
		<div class="text-white flex items-center gap-[24px] flex-col justify-start">
			<span>Account data</span>
			<span>
				Network: {networkId !== undefined ? networkId : 'Not connected'}
			</span>
			<span>
				Address: {address !== undefined ? address : 'Not connected'}
			</span>
		</div>
	);
};
