# Add AI services

All services where the prompts are sent can be found in `src/app/ais` folder. Each service has a separate folder, including:

- a component to manage the settings page
- a type folder defining the types like the configuration values, request and responses
- a service, extending the `AI` class

A good reference is to look at the existing services like `openai`.

To add it to the list, the new service needs to be added to the `services` list in the `src/app/ais/ai.service.ts` file.

The selection option on the main page will only show the ones that have a configuration set. The tool will not check automatically if the API key is still valid or if the balance is still enough to use the service.
