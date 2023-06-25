import server from './server';
import dotenv from 'dotenv';
import { routes } from './presentation/routers';
import { ContractDataSource } from './data/data-sources';
import * as path from "path";

const contractDS = new ContractDataSource();

dotenv.config();

console.log(process.env.PORT);
const port = process.env.PORT || 3001;

const keyDirectoryPath = path.resolve(__dirname, '..', process.env.KEY_DIRECTORY_PATH || '');
const certPath = path.resolve(__dirname, '..', process.env.CERT_PATH || '');

server.use("/api/v1", routes);

server.listen(process.env.PORT, async () => {
	const connection = await contractDS.connectContract(
		certPath,
		keyDirectoryPath
	);
	const { contract, client, gateway } = connection;

	try {
		const jsonIsInitialized = await contract.evaluateTransaction("isInitialized");
		const utf8Decoder = new TextDecoder();
		const isInitialized = utf8Decoder.decode(jsonIsInitialized);
		if (isInitialized === 'false') {
			const init = await contractDS.initLedger(contract);
			console.log("Smart Contract Initialized");
			await contract.submitTransaction(
				"Mint",
				"1000000"
			);
		}
		client.close();
		gateway.close();
	} catch (ex) {
		console.log(ex);
		client.close();
		gateway.close();
	}

	console.log(`App listening on PORT ${port}`);
});