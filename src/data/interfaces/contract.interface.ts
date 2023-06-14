import * as grpc from '@grpc/grpc-js';
import { Contract, Identity, Signer } from '@hyperledger/fabric-gateway';
import { Connection } from './connection.interface';


export interface ContractInterface {
	newGrpConnection(): Promise<grpc.Client>;
	newIdentity(): Promise<Identity>;
	newSigner(): Promise<Signer>;
	connectContract(): Promise<Connection>;
	initLedger(contract: Contract): Promise<void>;
}