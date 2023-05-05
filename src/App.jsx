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
	extendTheme,
	ChakraProvider,
	Card,
	useToast,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner';

const customTheme = extendTheme({
	colors: {
		background: '#0B2447',
		cardColor: '#19376D',
		btnColor: '#576CBC',
		secondary: '#A5D7E8',
	},
});

function App() {
	const [userAddress, setUserAddress] = useState('');
	const [results, setResults] = useState([]);
	const [hasQueried, setHasQueried] = useState(false);
	const [tokenDataObjects, setTokenDataObjects] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();
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
			toast({
				title: 'Error',
				description: 'Failed to connect wallet',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	async function getTokenBalance() {
		setIsLoading(true);
		try {
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
		} catch (error) {
			console.log('Failed to fetch data:', error);
		}
	}
	const maxLength = 14;
	return (
		<ChakraProvider theme={customTheme}>
			<Box minHeight='100vh' w='100vw' bgColor='background'>
				<Box
					display='flex'
					justifyContent='flex-end'
					alignItems='center'
					height='50px'
					pt={5}
					pr={10}>
					<Button
						bgColor='btnColor'
						size='md'
						onClick={connectWallet}
						focusBorderColor='none'
						color='white'
						borderRadius={20}
						_hover={{
							backgroundColor: '#8a9ce2',
							color: 'white',
						}}>
						Connect Wallet
					</Button>
				</Box>
				<Center flexDirection={'column'} h={'75vh'}>
					<Flex
						alignItems={'center'}
						justifyContent='center'
						flexDirection={'column'}>
						<Heading mb={0} fontSize={48} color='secondary'>
							ERC-20 Token Indexer
						</Heading>
						<Text color='gray'>
							Plug in an address and this website will return all of its ERC-20
							token balances!
						</Text>
					</Flex>
					<Box w='100%' mt={10}>
						<Center>
							<Flex flexDirection={'column'}>
								<Input
									onChange={(e) => setUserAddress(e.target.value)}
									color='black'
									textAlign='center'
									// p={4}
									bgColor='white'
									fontSize={24}
									value={userAddress}
									width='900px'
									size='lg'
									borderRadius={20}
									mb={19}
								/>

								<Button
									fontSize={20}
									onClick={getTokenBalance}
									mt={10}
									bgColor='btnColor'
									color='white'
									display={'block'}
									width='350px'
									textAlign={'center'}
									borderRadius={20}
									size={'lg'}
									m={'auto'}
									_hover={{
										backgroundColor: '#8a9ce2',
										color: 'white',
									}}>
									Check ERC-20 Token Balances
								</Button>
							</Flex>
						</Center>
					</Box>
				</Center>
				<Box>
					{isLoading ? (
						<Center>
							<Oval
								height={80}
								width={80}
								color='#A5D7E8'
								wrapperStyle={{}}
								wrapperClass=''
								visible={true}
								ariaLabel='oval-loading'
								secondaryColor='#A5D7E8'
								strokeWidth={2}
								strokeWidthSecondary={2}
							/>
						</Center>
					) : hasQueried ? (
						<Box p={10}>
							<Heading
								my={25}
								color='secondary'
								fontSize={28}
								textAlign={'center'}>
								Here are the ERC-20 token balances
							</Heading>
							<SimpleGrid w={'90vw'} columns={4} spacing={24}>
								{results.tokenBalances.map((e, i) => {
									return (
										<Card
											bg='#19376D'
											borderRadius={20}
											p='4'
											color='white'
											w='300px'
											key={e.id}>
											<Box display='flex' alignItems='center'>
												<Image
													src={tokenDataObjects[i].logo}
													alt='Your image'
													h='50px'
													w='50px'
													mr='4'
												/>
												<Box>
													<Box fontSize='md'>
														<b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;
													</Box>
													<Box fontSize='md'>
														Balance:&nbsp;
														{Utils.formatUnits(
															e.tokenBalance,
															tokenDataObjects[i].decimals,
														)
															.toString()
															.slice(0, 11).length <
														Utils.formatUnits(
															e.tokenBalance,
															tokenDataObjects[i].decimals,
														).toString().length
															? Utils.formatUnits(
																	e.tokenBalance,
																	tokenDataObjects[i].decimals,
															  )
																	.toString()
																	.slice(0, 11) + '...'
															: Utils.formatUnits(
																	e.tokenBalance,
																	tokenDataObjects[i].decimals,
															  )}
													</Box>
												</Box>
											</Box>
										</Card>
										// <Flex
										// 	flexDir={'column'}
										// 	color='white'
										// 	bg='blue'
										// 	w={'20vw'}
										// 	>
										// 	<Box>

										// 	</Box>
										// 	<Box>

										// 	</Box>
										// 	<Image  />
										// </Flex>
									);
								})}
							</SimpleGrid>
						</Box>
					) : (
						''
					)}
				</Box>
			</Box>
		</ChakraProvider>
	);
}

export default App;
