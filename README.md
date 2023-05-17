# ERC-20 Indexer

ERC-20 Indexer is an application that utilizes the Alchemy SDK rigged to Alchemy's Enhanced APIs to display all ERC-20 token balances associated with a specific Ethereum address. This project aims to provide users with an easy way to view their token balances and offers various features and improvements to enhance the user experience.

## Features

- ERC-20 Token Balances: The ERC-20 Indexer retrieves and displays all token balances associated with a specified Ethereum address.
- Alchemy Integration: The application utilizes the Alchemy SDK rigged to Alchemy's Enhanced APIs to efficiently retrieve the required data.
- Wallet Integration: Users can connect their wallets to check their ERC-20 token balances.
- Loading Indication: The application provides visual loading indicators to indicate when a request is in progress, improving the user experience.
- Error Handling: The application includes error checking for incorrectly formed requests and provides informative feedback to the user.
- Image and Grid Display: Token images and the overall grid layout have been improved for a more polished look and feel.
- Performance Optimization: The application has been optimized to provide faster query response times, ensuring efficient data retrieval.

## Getting Started

To get started with the ERC-20 Indexer on your local machine, follow these steps:

### Prerequisites

- Node.js (v14.0.0 or later)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/erc20-indexer.git
   ```

2. Install the dependencies:

   ```bash
   cd erc20-indexer
   npm install
   ```

### Usage

1. Obtain an Alchemy API key from [Alchemy](https://www.alchemy.com/).

2. Set your Alchemy API key as an environment variable. You can create a `.env` file in the root directory and add the following line:

   ```plaintext
   ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open your web browser and navigate to `http://localhost:3000`.


Happy indexing with the ERC-20 Indexer!
