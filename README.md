# auth-tokenizer

Tokenize using the Rebilly API.

### Install

Clone the repo and run `yarn install`, then copy the `.env` file and define your API key and target URL.

### Environment Variables

```bash
TARGET_URL=https://demo.acme.test.com
API_KEY=sk_sandbox_0000000000000000000000000000
API_URL=https://api-sandbox.rebilly.com
```

### Usage

To trigger a token and open in the browser run 

```bash
yarn go -c <customerId>
```

The default redirect is Google but can be overwritten with `-r URL`.

```bash
yarn go -c <customerId> -r https://amazon.com
```
