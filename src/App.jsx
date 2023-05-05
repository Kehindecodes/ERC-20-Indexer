import {
	Box,
	Button,
	Center,
	Flex,
	Heading,
	Image,
	Input,
	SimpleGrid,
	Text,
	Container,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner';

function App() {
	const [userAddress, setUserAddress] = useState('');
	const [results, setResults] = useState([]);
	const [hasQueried, setHasQueried] = useState(false);
	const [tokenDataObjects, setTokenDataObjects] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const connectWallet = async () => {
		try {
			// Request account access
			const wallet = await window.ethereum.request({
				method: 'eth_requestAccounts',
			});
			setUserAddress(wallet[0]);
			console.log(wallet[0]);
			console.log('Wallet connected');
		} catch (error) {
			console.log('Failed to connect wallet');
		}
	};

	async function getTokenBalance() {
		setIsLoading(true);
		const config = {
			apiKey: import.meta.env.VITE_API_KEY,
			network: Network.ETH_MAINNET,
		};
		const alchemy = new Alchemy(config);
		const data = await alchemy.core.getTokenBalances(userAddress);

		setResults(data);

		const tokenDataPromises = [];

		for (let i = 0; i < data.tokenBalances.length; i++) {
			const tokenData = alchemy.core.getTokenMetadata(
				data.tokenBalances[i].contractAddress,
			);
			tokenDataPromises.push(tokenData);
		}

		setTokenDataObjects(await Promise.all(tokenDataPromises));
		setHasQueried(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}

	return (
		<Box w='100vw'>
			<Container maxW='container.sm' padding='4'>
				<Box
					display='flex'
					justifyContent='flex-end'
					alignItems='center'
					height='50px'
					paddingRight='20px'>
					<Button
						bgColor='blue'
						size='md'
						onClick={connectWallet}
						focusBorderColor='none'>
						Connect Wallet
					</Button>
				</Box>
				<Center>
					<Flex
						alignItems={'center'}
						justifyContent='center'
						flexDirection={'column'}>
						<Heading mb={0} fontSize={36}>
							ERC-20 Token Indexer
						</Heading>
						<Text>
							Plug in an address and this website will return all of its ERC-20
							token balances!
						</Text>
					</Flex>
				</Center>
				<Flex
					w='100%'
					flexDirection='column'
					alignItems='center'
					justifyContent={'center'}>
					<Heading mt={42}>
						Get all the ERC-20 token balances of this address:
					</Heading>
					<Input
						onChange={(e) => setUserAddress(e.target.value)}
						color='black'
						w='600px'
						textAlign='center'
						p={4}
						bgColor='white'
						fontSize={24}
						value={userAddress}
					/>
					<Button
						fontSize={20}
						onClick={getTokenBalance}
						mt={36}
						bgColor='blue'>
						Check ERC-20 Token Balances
					</Button>

					<Heading my={36}>ERC-20 token balances:</Heading>
					{isLoading ? (
						<Oval
							height={80}
							width={80}
							color='#4fa94d'
							wrapperStyle={{}}
							wrapperClass=''
							visible={true}
							ariaLabel='oval-loading'
							secondaryColor='#4fa94d'
							strokeWidth={2}
							strokeWidthSecondary={2}
						/>
					) : hasQueried ? (
						<SimpleGrid w={'90vw'} columns={4} spacing={24}>
							{results.tokenBalances.map((e, i) => {
								return (
									<Flex
										flexDir={'column'}
										color='white'
										bg='blue'
										w={'20vw'}
										key={e.id}>
										<Box>
											<b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;
										</Box>
										<Box>
											<b>Balance:</b>&nbsp;
											{Utils.formatUnits(
												e.tokenBalance,
												tokenDataObjects[i].decimals,
											)}
										</Box>
										<Image src={tokenDataObjects[i].logo} />
									</Flex>
								);
							})}
						</SimpleGrid>
					) : (
						'Please make a query! This may take a few seconds...'
					)}
				</Flex>
			</Container>
		</Box>
	);
}

export default App;
