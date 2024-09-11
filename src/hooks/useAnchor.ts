import { web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import idl from "@/utils/smart-contract/event_protocol.json";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useUserStore } from "@/stores/userStore";
import { useMemo } from "react";

export const useAnchor = () => {
	const wallet = useAnchorWallet();
	const { network } = useUserStore();

	const endpoint = useMemo(() => {
		switch (network) {
			case "solana":
				return web3.clusterApiUrl("devnet");
			case "sonic":
				return "https://devnet.sonic.game";
			default:
				return web3.clusterApiUrl("devnet");
		}
	}, [network]);

	const provider = new anchor.AnchorProvider(
		new web3.Connection(endpoint),
		wallet!,
	);
	anchor.setProvider(provider);

	const program = new anchor.Program(idl as EventProtocol, provider);
	const [master] = web3.PublicKey.findProgramAddressSync(
		[Buffer.from("master")],
		program.programId,
	);
	return { program, provider, wallet, masterProgramAddress: master };
};
