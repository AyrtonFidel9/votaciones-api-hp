import { Contract, Gateway } from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';

export interface Connection {
	contract: Contract;
	client: grpc.Client;
	gateway: Gateway;
}