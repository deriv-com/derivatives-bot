# Deriv Bot

This is the official repository for Deriv Bot, a visual programming tool that allows you to build and run your own trading bots on the Deriv platform. With Deriv Bot, you can create, test, and deploy automated trading strategies using a simple drag-and-drop interface, without writing any code.

## Features

*   **Visual Bot Builder:** Build trading bots with an intuitive drag-and-drop interface powered by Blockly.
*   **Pre-built Strategies:** Get started quickly with pre-built strategies like Martingale, D'Alembert, and Oscar's Grind.
*   **Customizable Strategies:** Create your own custom strategies from scratch or modify existing ones to suit your needs.
*   **Backtesting:** Test your strategies against historical data to see how they would have performed.
*   **Cross-Platform:** Access Deriv Bot on any device, with a responsive design that works on desktop and mobile.

## Getting Started

To run the development server:

```bash
npm install
npm run dev
```

This will start the development server and open the application in your default browser.

To generate a build:

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Contributing

We welcome contributions from the community. If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with a descriptive commit message.
4.  Push your changes to your fork.
5.  Create a pull request to the `main` branch of this repository.

Please make sure your code adheres to our coding standards and passes all the tests.

## Deploying to Cloudflare Pages

In order to generate a deployment to Cloudflare Pages, ensure that the following secrets are set in the Github Actions:

```bash
CLOUDFLARE_ACCOUNT_ID=****
CLOUDFLARE_API_TOKEN=****
CLOUDFLARE_PROJECT_NAME=****
```

## Generating a test link preview to Cloudflare Pages

In order to generate a test link deployment to Cloudflare Pages, ensure that the following secrets are set in the Github Actions:

```bash
CLOUDFLARE_ACCOUNT_ID=****
CLOUDFLARE_TEST_LINK_TOKEN=****
CLOUDFLARE_PROJECT_NAME=****
```

## Notifications to Slack

To allow notifications to be sent to Slack whenever a new staging build is triggered, ensure that the following secrets are set in the Github Actions:

```bash
SLACK_WEBHOOK=***
```

## License

This project is licensed under the terms of the `LICENSE` file.
