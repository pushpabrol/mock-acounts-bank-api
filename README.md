
# Mock Bank API

## Overview
This Mock Bank API simulates basic banking operations such as transferring funds between accounts and retrieving account information. It is protected by Auth0, ensuring that only authenticated users can access these functionalities.

## Features
- **Transfer Funds**: Allows authenticated users to transfer funds between accounts.
- **Get User Accounts**: Retrieves the account details of an authenticated user.

## Prerequisites
- Node.js
- npm (Node Package Manager)
- Auth0 account for JWT authentication

## Installation
1. **Clone the Repository**
    ```sh
    git clone https://github.com/your-repository/mock-bank-api.git
    cd mock-bank-api
    ```

2. **Install Dependencies**
    ```sh
    npm install
    ```

3. **Set Up Environment Variables**
    Create a `.env` file in the project root and add the following variables:
    ```
    AUTH0_DOMAIN=your-auth0-domain
    AUTH0_AUDIENCE=your-api-audience
    ```

4. **Run the Server**
    ```sh
    node app.js
    ```

## API Endpoints

### Transfer Funds
- **URL**: `/transfer`
- **Method**: `POST`
- **Auth Required**: Yes
- **Data Constraints**:
    ```json
    {
        "from": "[valid account number]",
        "to": "[valid account number]",
        "amount": "[positive number]"
    }
    ```
- **Success Response**: 
    - **Code**: `200 OK`
    - **Content**: `{ message: "Transfer successful", balance: [new balance] }`

### Get User Accounts
- **URL**: `/getUserAccounts`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Params**: 
- **Success Response**: 
    - **Code**: `200 OK`
    - **Content**: `[Array of Account Objects]`

## Authentication
This API uses JWT tokens for authentication. Tokens should be obtained from Auth0 and included in the `Authorization` header as a Bearer token.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

