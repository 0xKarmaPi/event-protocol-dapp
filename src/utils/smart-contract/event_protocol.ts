/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/event_protocol.json`.
 */
export type EventProtocol = {
	address: "4om3tmwcjESCkngvezJSyAerKgSfggCgf2LZe4XZk3HL";
	metadata: {
		name: "eventProtocol";
		version: "0.1.0";
		spec: "0.1.0";
		description: "Created with Anchor";
	};
	instructions: [
		{
			name: "claimRewards";
			discriminator: [4, 144, 132, 71, 116, 23, 151, 80];
			accounts: [
				{
					name: "signer";
					docs: ["The transaction's signer"];
					writable: true;
					signer: true;
				},
				{
					name: "event";
					docs: ["The prediction event"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									112,
									114,
									101,
									100,
									105,
									99,
									116,
									105,
									111,
									110,
									95,
									101,
									118,
									101,
									110,
									116,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "ticket";
					docs: ["The ticket of signer on the above event"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [116, 105, 99, 107, 101, 116];
							},
							{
								kind: "account";
								path: "event.result.ok_or(Error :: ResultNotSetEvent) ? ";
								account: "predictionEvent";
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
							{
								kind: "account";
								path: "signer";
							},
						];
					};
				},
				{
					name: "leftMint";
					docs: ["The mint of the event's token left side"];
					optional: true;
				},
				{
					name: "leftPool";
					docs: [
						"The token account that contains the left side tokens",
					];
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									108,
									101,
									102,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "signerLeftBeneficiaryAta";
					docs: [
						"The signer's associated token account of left mint",
					];
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "signer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "leftMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "rightMint";
					docs: ["The mint of the event's token right side"];
					optional: true;
				},
				{
					name: "rightPool";
					docs: [
						"The token account that contains the right side tokens",
					];
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									114,
									105,
									103,
									104,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "signerRightBeneficiaryAta";
					docs: [
						"The optional signer's associated token account of right mint",
					];
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "signer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "rightMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
				{
					name: "associatedTokenProgram";
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
			];
			args: [];
		},
		{
			name: "closeEvent";
			discriminator: [117, 114, 193, 54, 49, 25, 75, 194];
			accounts: [
				{
					name: "signer";
					docs: ["The transaction's signer"];
					writable: true;
					signer: true;
				},
				{
					name: "event";
					docs: ["The prediction event"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									112,
									114,
									101,
									100,
									105,
									99,
									116,
									105,
									111,
									110,
									95,
									101,
									118,
									101,
									110,
									116,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "leftMint";
					docs: ["The mint of the event's token left side"];
					optional: true;
				},
				{
					name: "leftPool";
					docs: [
						"The token account that contains the left side tokens",
					];
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									108,
									101,
									102,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "rightMint";
					docs: ["The mint of the event's token right side"];
					optional: true;
				},
				{
					name: "rightPool";
					docs: [
						"The token account that contains the right side tokens",
					];
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									114,
									105,
									103,
									104,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [];
		},
		{
			name: "createEventTokenAccount";
			discriminator: [95, 30, 40, 188, 166, 138, 221, 71];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "event";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									112,
									114,
									101,
									100,
									105,
									99,
									116,
									105,
									111,
									110,
									95,
									101,
									118,
									101,
									110,
									116,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "mint";
				},
				{
					name: "pool";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "arg";
								path: "side";
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "side";
					type: {
						defined: {
							name: "side";
						};
					};
				},
			];
		},
		{
			name: "createSystemFeeTokenAccount";
			discriminator: [153, 113, 240, 198, 98, 213, 234, 177];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "mint";
				},
				{
					name: "systemFee";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									115,
									121,
									115,
									116,
									101,
									109,
									95,
									102,
									101,
									101,
								];
							},
							{
								kind: "account";
								path: "mint";
							},
						];
					};
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "deployEvent";
			discriminator: [162, 199, 175, 211, 226, 95, 182, 33];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "event";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									112,
									114,
									101,
									100,
									105,
									99,
									116,
									105,
									111,
									110,
									95,
									101,
									118,
									101,
									110,
									116,
								];
							},
							{
								kind: "arg";
								path: "id";
							},
						];
					};
				},
				{
					name: "leftMint";
					docs: ["The mint of the event's token left side"];
					optional: true;
				},
				{
					name: "rightMint";
					docs: ["The mint of the event's token right side"];
					optional: true;
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "id";
					type: "pubkey";
				},
				{
					name: "title";
					type: "string";
				},
				{
					name: "description";
					type: "string";
				},
				{
					name: "leftDescription";
					type: "string";
				},
				{
					name: "rightDescription";
					type: "string";
				},
				{
					name: "startDate";
					type: "u64";
				},
				{
					name: "endDate";
					type: "u64";
				},
				{
					name: "burning";
					type: "bool";
				},
			];
		},
		{
			name: "finishEvent";
			discriminator: [212, 237, 21, 119, 133, 119, 103, 57];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "master";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [109, 97, 115, 116, 101, 114];
							},
						];
					};
				},
				{
					name: "event";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									112,
									114,
									101,
									100,
									105,
									99,
									116,
									105,
									111,
									110,
									95,
									101,
									118,
									101,
									110,
									116,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "leftMint";
					writable: true;
					optional: true;
				},
				{
					name: "leftPool";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									108,
									101,
									102,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "systemLeftFee";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									115,
									121,
									115,
									116,
									101,
									109,
									95,
									102,
									101,
									101,
								];
							},
							{
								kind: "account";
								path: "event.left_mint.ok_or(Error :: NonLeftEvent) ? ";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "creatorLeftBeneficiaryAta";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "signer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "leftMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "rightMint";
					writable: true;
					optional: true;
				},
				{
					name: "rightPool";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									114,
									105,
									103,
									104,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "systemRightFee";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									115,
									121,
									115,
									116,
									101,
									109,
									95,
									102,
									101,
									101,
								];
							},
							{
								kind: "account";
								path: "event.right_mint.ok_or(Error :: NonRightEvent) ? ";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "creatorRightBeneficiaryAta";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "signer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "rightMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
				{
					name: "associatedTokenProgram";
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
			];
			args: [
				{
					name: "result";
					type: {
						defined: {
							name: "side";
						};
					};
				},
			];
		},
		{
			name: "initialize";
			discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "master";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [109, 97, 115, 116, 101, 114];
							},
						];
					};
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "voteEvent";
			discriminator: [65, 177, 211, 246, 176, 1, 166, 42];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "event";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									112,
									114,
									101,
									100,
									105,
									99,
									116,
									105,
									111,
									110,
									95,
									101,
									118,
									101,
									110,
									116,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "ticket";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [116, 105, 99, 107, 101, 116];
							},
							{
								kind: "arg";
								path: "selection";
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
							{
								kind: "account";
								path: "signer";
							},
						];
					};
				},
				{
					name: "leftMint";
					optional: true;
				},
				{
					name: "leftPool";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									108,
									101,
									102,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "signerLeftAta";
					writable: true;
					optional: true;
				},
				{
					name: "rightMint";
					optional: true;
				},
				{
					name: "rightPool";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									114,
									105,
									103,
									104,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "signerRightAta";
					writable: true;
					optional: true;
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [
				{
					name: "selection";
					type: {
						defined: {
							name: "side";
						};
					};
				},
				{
					name: "amount";
					type: "u64";
				},
			];
		},
		{
			name: "withdrawDeposited";
			discriminator: [48, 76, 240, 39, 244, 236, 121, 240];
			accounts: [
				{
					name: "signer";
					writable: true;
					signer: true;
				},
				{
					name: "event";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									112,
									114,
									101,
									100,
									105,
									99,
									116,
									105,
									111,
									110,
									95,
									101,
									118,
									101,
									110,
									116,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "ticket";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [116, 105, 99, 107, 101, 116];
							},
							{
								kind: "account";
								path: "event.result.ok_or(Error :: ResultNotSetEvent) ? ";
								account: "predictionEvent";
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
							{
								kind: "account";
								path: "signer";
							},
						];
					};
				},
				{
					name: "leftMint";
					optional: true;
				},
				{
					name: "leftPool";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									108,
									101,
									102,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "signerLeftBeneficiaryAta";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "signer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "leftMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "rightMint";
					optional: true;
				},
				{
					name: "rightPool";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									114,
									105,
									103,
									104,
									116,
									95,
									112,
									111,
									111,
									108,
								];
							},
							{
								kind: "account";
								path: "event.id";
								account: "predictionEvent";
							},
						];
					};
				},
				{
					name: "signerRightBeneficiaryAta";
					writable: true;
					optional: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "signer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "rightMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
				{
					name: "associatedTokenProgram";
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
			];
			args: [];
		},
	];
	accounts: [
		{
			name: "master";
			discriminator: [168, 213, 193, 12, 77, 162, 58, 235];
		},
		{
			name: "predictionEvent";
			discriminator: [88, 209, 255, 99, 200, 19, 183, 221];
		},
		{
			name: "ticket";
			discriminator: [41, 228, 24, 165, 78, 90, 235, 200];
		},
	];
	events: [
		{
			name: "claimRewardsEvent";
			discriminator: [224, 197, 51, 113, 233, 72, 117, 183];
		},
		{
			name: "closeEvtEvent";
			discriminator: [64, 102, 82, 135, 37, 85, 246, 228];
		},
		{
			name: "deployEvtEvent";
			discriminator: [54, 213, 11, 141, 103, 158, 194, 212];
		},
		{
			name: "finishEvtEvent";
			discriminator: [36, 249, 235, 117, 182, 8, 157, 74];
		},
		{
			name: "voteEvtEvent";
			discriminator: [227, 181, 225, 2, 141, 225, 179, 80];
		},
		{
			name: "withdrawEvent";
			discriminator: [22, 9, 133, 26, 160, 44, 71, 192];
		},
	];
	errors: [
		{
			code: 6000;
			name: "invalidTime";
			msg: "Invalid time";
		},
		{
			code: 6001;
			name: "nonLeftEvent";
			msg: "This event does not have the left mint and left pool";
		},
		{
			code: 6002;
			name: "nonRightEvent";
			msg: "This event does not have the right mint and right pool";
		},
		{
			code: 6003;
			name: "missingLeftPool";
			msg: "Missing left pool account";
		},
		{
			code: 6004;
			name: "missingRightPool";
			msg: "Missing right pool account";
		},
		{
			code: 6005;
			name: "missingSenderAta";
			msg: "Missing sender's ata";
		},
		{
			code: 6006;
			name: "missingCreatorFeeAta";
			msg: "Missing creator fee's ata";
		},
		{
			code: 6007;
			name: "missingPlatformFeeAta";
			msg: "Missing platform fee's ata";
		},
		{
			code: 6008;
			name: "notFinishedEvent";
			msg: "This event has not finsished yet, the end date is not reached or creator have not finished its";
		},
		{
			code: 6009;
			name: "finishedEvent";
			msg: "This event had finished";
		},
		{
			code: 6010;
			name: "notStartedEvent";
			msg: "This event has not started yet";
		},
		{
			code: 6011;
			name: "startedEvent";
			msg: "This event had started";
		},
		{
			code: 6012;
			name: "missingLeftMint";
			msg: "Missing left mint";
		},
		{
			code: 6013;
			name: "missingRightMint";
			msg: "Missing left mint";
		},
		{
			code: 6014;
			name: "burningEvent";
			msg: "The event is not allow to claim, the tokens losing side had burned";
		},
		{
			code: 6015;
			name: "resultNotSetEvent";
			msg: "The event has not set result";
		},
		{
			code: 6016;
			name: "alreadyClaimed";
			msg: "Already claimed from this event";
		},
		{
			code: 6017;
			name: "alreadyWithdrawn";
			msg: "Already withdrawn from this event";
		},
	];
	types: [
		{
			name: "claimRewardsEvent";
			type: {
				kind: "struct";
				fields: [
					{
						name: "eventKey";
						type: "pubkey";
					},
					{
						name: "ticketKey";
						type: "pubkey";
					},
					{
						name: "signer";
						type: "pubkey";
					},
					{
						name: "amount";
						type: "u64";
					},
				];
			};
		},
		{
			name: "closeEvtEvent";
			type: {
				kind: "struct";
				fields: [
					{
						name: "key";
						type: "pubkey";
					},
				];
			};
		},
		{
			name: "deployEvtEvent";
			type: {
				kind: "struct";
				fields: [
					{
						name: "key";
						type: "pubkey";
					},
					{
						name: "id";
						type: "pubkey";
					},
					{
						name: "bump";
						type: "u8";
					},
					{
						name: "title";
						type: "string";
					},
					{
						name: "description";
						type: "string";
					},
					{
						name: "leftDescription";
						type: "string";
					},
					{
						name: "rightDescription";
						type: "string";
					},
					{
						name: "creator";
						type: "pubkey";
					},
					{
						name: "endDate";
						type: "u64";
					},
					{
						name: "startDate";
						type: "u64";
					},
					{
						name: "burning";
						type: "bool";
					},
					{
						name: "leftMint";
						type: {
							option: "pubkey";
						};
					},
					{
						name: "rightMint";
						type: {
							option: "pubkey";
						};
					},
				];
			};
		},
		{
			name: "finishEvtEvent";
			type: {
				kind: "struct";
				fields: [
					{
						name: "key";
						type: "pubkey";
					},
					{
						name: "result";
						type: {
							defined: {
								name: "side";
							};
						};
					},
				];
			};
		},
		{
			name: "master";
			docs: [
				"The master account who authorized person related to the fee system",
			];
			type: {
				kind: "struct";
				fields: [
					{
						name: "address";
						docs: ["The master's wallet pubkey"];
						type: "pubkey";
					},
					{
						name: "bump";
						docs: ["The account's canonical bump"];
						type: "u8";
					},
				];
			};
		},
		{
			name: "predictionEvent";
			docs: ["The prediction event account"];
			type: {
				kind: "struct";
				fields: [
					{
						name: "id";
						docs: [
							"The event's unique id that is generated before deploying",
						];
						type: "pubkey";
					},
					{
						name: "creator";
						docs: ["The event creator's wallet pubkey"];
						type: "pubkey";
					},
					{
						name: "bump";
						docs: ["The account's canonical bump"];
						type: "u8";
					},
					{
						name: "startDate";
						docs: [
							"The event's starting date in seconds timestamp",
						];
						type: "u64";
					},
					{
						name: "endDate";
						docs: ["The event's ending date in seconds timestamp"];
						type: "u64";
					},
					{
						name: "leftPool";
						docs: ["The left side vault's amount"];
						type: "u64";
					},
					{
						name: "rightPool";
						docs: ["The right side vault's amount"];
						type: "u64";
					},
					{
						name: "leftMint";
						docs: [
							"The left side token mint's pubkey.",
							"If the left side is solana native token instead, it should be None",
						];
						type: {
							option: "pubkey";
						};
					},
					{
						name: "rightMint";
						docs: [
							"The right side token mint's pubkey.",
							"If the right side is solana native token instead, it should be None",
						];
						type: {
							option: "pubkey";
						};
					},
					{
						name: "result";
						docs: [
							"The event's event, it was be set by the creator",
						];
						type: {
							option: {
								defined: {
									name: "side";
								};
							};
						};
					},
					{
						name: "burning";
						docs: [
							"The optional burning configuration,",
							"If set true the tokens losing side would be burned instead of claiming from the winning side's winners",
						];
						type: "bool";
					},
				];
			};
		},
		{
			name: "side";
			type: {
				kind: "enum";
				variants: [
					{
						name: "left";
					},
					{
						name: "right";
					},
				];
			};
		},
		{
			name: "ticket";
			docs: ["The ticket account represents the choice of predictors"];
			type: {
				kind: "struct";
				fields: [
					{
						name: "creator";
						docs: ["The predictor's wallet pubkey"];
						type: "pubkey";
					},
					{
						name: "amount";
						docs: ["The bet amount for the choice"];
						type: "u64";
					},
					{
						name: "selection";
						docs: ["The choice's side"];
						type: {
							defined: {
								name: "side";
							};
						};
					},
					{
						name: "claimed";
						type: "bool";
					},
					{
						name: "withdrawn";
						type: "bool";
					},
				];
			};
		},
		{
			name: "voteEvtEvent";
			type: {
				kind: "struct";
				fields: [
					{
						name: "ticketKey";
						type: "pubkey";
					},
					{
						name: "eventKey";
						type: "pubkey";
					},
					{
						name: "creator";
						type: "pubkey";
					},
					{
						name: "selection";
						type: {
							defined: {
								name: "side";
							};
						};
					},
					{
						name: "amount";
						type: "u64";
					},
				];
			};
		},
		{
			name: "withdrawEvent";
			type: {
				kind: "struct";
				fields: [
					{
						name: "eventKey";
						type: "pubkey";
					},
					{
						name: "ticketKey";
						type: "pubkey";
					},
					{
						name: "signer";
						type: "pubkey";
					},
					{
						name: "amount";
						type: "u64";
					},
				];
			};
		},
	];
	constants: [
		{
			name: "masterSeeds";
			type: {
				array: ["u8", 6];
			};
			value: "[109, 97, 115, 116, 101, 114]";
		},
		{
			name: "predictionEventSeedsPrefix";
			type: {
				array: ["u8", 16];
			};
			value: "[112, 114, 101, 100, 105, 99, 116, 105, 111, 110, 95, 101, 118, 101, 110, 116]";
		},
		{
			name: "ticketSeedsPrefix";
			type: {
				array: ["u8", 6];
			};
			value: "[116, 105, 99, 107, 101, 116]";
		},
		{
			name: "tokensLeftPoolSeedsPrefix";
			type: {
				array: ["u8", 9];
			};
			value: "[108, 101, 102, 116, 95, 112, 111, 111, 108]";
		},
		{
			name: "tokensRightPoolSeedsPrefix";
			type: {
				array: ["u8", 10];
			};
			value: "[114, 105, 103, 104, 116, 95, 112, 111, 111, 108]";
		},
		{
			name: "tokensSystemFeeSeedsPrefix";
			type: {
				array: ["u8", 10];
			};
			value: "[115, 121, 115, 116, 101, 109, 95, 102, 101, 101]";
		},
	];
};
