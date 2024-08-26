import { web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import idl from "@/utils/smart-contract/event_protocol.json";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { connection } from "@/providers/WalletContextProvider";

export const useAnchor = () => {
	const wallet = useAnchorWallet();

	const provider = new anchor.AnchorProvider(connection, wallet!);
	anchor.setProvider(provider);

	const program = new anchor.Program(idl as EventProtocol, provider);
	const [master] = web3.PublicKey.findProgramAddressSync(
		[Buffer.from("master")],
		program.programId,
	);
	return { program, provider, wallet, masterProgramAddress: master };
};
