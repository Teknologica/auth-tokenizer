const RebillyAPI = require('rebilly-js-sdk').default;
const chalk = require('chalk');
const open = require('open');
const config = require('dotenv').config();
const program = require('commander');

const {parsed: {API_KEY = null, TARGET_URL = null, API_URL = null}} = config;
const log = console.log;

program
    .option('-o, --open', 'open page for pre-existing customer token')
    .option('-t, --target <url>', 'URL to target when opening in the browser')
    .option('-r, --redirect <url>', 'URL to redirect to at the end of the operation')
    .option('-c, --customerId <id>', 'customer ID for which to create token');

program.parse(process.argv);

// check API key
if (API_KEY === null) {
    return log(chalk.red(`API Key not defined in .env file`));
}

const sandbox = API_KEY.includes('_sandbox');
const api = RebillyAPI({apiKey: API_KEY, sandbox});
const targetURL = program.target || TARGET_URL;
const endpoint = API_URL ? API_URL : `http://api-sandbox.dev-local.rebilly.com`;
api.setEndpoints({[sandbox ? 'sandbox' : 'live']: endpoint});

const announce = (title) => {
    log(chalk.bold.cyan(title));
};

// check URL
if (targetURL === null) {
    return log(chalk.red(`Target URL not found`));
}

if (program.open) {
    announce('Open Pre-Existing');
    // TODO
} else {
    if (!program.customerId) {
        // TODO add command to create customer
        return log(chalk.red(`No customer ID provided`));
    }
    // async wrap
    (async () => {
        const data = {
            mode: 'passwordless',
            customerId: program.customerId,
        };
        try {
            const {fields: {token}} = await api.customerAuthentication.login({data});
            announce('Creating Token...');
            log(chalk.yellow(token));
            announce('Opening Browser...');
            const redirect = program.redirect ? program.redirect : `https://www.google.ca`;
            const page = `${targetURL}/?token=${token}&redirectUrl=${redirect}`;
            log(chalk.yellow(page));
            await open(page);
        } catch (err) {
            return log(err);
        }
    })();
}
