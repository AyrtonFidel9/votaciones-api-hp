import * as grpc from '@grpc/grpc-js';
import { Contract, Gateway, Identity, Signer } from '@hyperledger/fabric-gateway';

export interface Connection {
	contract: Contract;
	client: grpc.Client;
	gateway: Gateway;
}

export interface ContractInterface {
	newGrpConnection(): Promise<grpc.Client>;
	newIdentity(): Promise<Identity>;
	newSigner(): Promise<Signer>;
	connectContract(): Promise<Connection>;
	initLedger(contract: Contract): Promise<void>;
}