# PromptPolish

PromptPolish a chrome extension, allowing you to copy content, polish it up with a prompt and an AI model, and paste it back to in the website.

## Installation

In the future this extension will be available on the Chrome Web Store, but for now you need to install it manually by downloading the latest release from the [release page](https://github.com/cre8/prompt-polish/releases).

## Security

Prompt information and access tokens are stored in the browser storage and will not be shared with any third party.

## Supported AI Services

Right now only OpenAI is supported, but the tool is designed to support multiple AI services in the future.

## Development

The extension is built using Angular. To run the extension locally, follow the steps below:

- Clone the repository
- Run `pnpm install`
- Run `pnpm run build`
- Open Chrome and go to `chrome://extensions/`
- Enable developer mode
- Click on `Load unpacked`
- Select the `dist/prompt-polish/browser/` folder in the repository.
