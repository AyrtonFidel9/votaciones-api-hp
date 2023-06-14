import * as FabricCAServices from 'fabric-ca-client';
import { Wallet } from "fabric-network";

export interface WalletInterface {
	buildCCPOrg(): Record<string, any>;
	buildWallet(): Promise<Wallet>;
	prettyJSONString(inputString: string): string;
	buildCAClient(ccp: Record<string, any>, caHostName: string): FabricCAServices;
	registerAndEnrollUser(
		caClient: FabricCAServices,
		wallet: Wallet,
		orgMspId: string,
		userId: string,
		affiliation: string,
		adminUserId: string,
	): Promise<void>;

	enrollAdmin(
		caClient: FabricCAServices,
		wallet: Wallet,
		orgMspId: string,
		adminUserId: string,
		adminUserPasswd: string): Promise<void>;
}