import * as grpc from '@grpc/grpc-js';
import { Contract, Identity, Signer } from '@hyperledger/fabric-gateway';
import { Connection } from './connection.interface';


export interface ContractInterface {
	newGrpConnection(): Promise<grpc.Client>;
	newIdentity(_credentials: Identity | string): Promise<Identity>;
	newSigner(_privateKeyPem: Identity | string): Promise<Signer>;
	connectContract(credentials: string | Identity, privateKey: Identity | string): Promise<Connection>;
	initLedger(contract: Contract): Promise<void>;
}