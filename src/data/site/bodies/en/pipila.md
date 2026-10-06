## Context and problem
A site needed to migrate from an obsolete platform, but it had a strong dependency on a service that received forms and sent the data to a data hub. Changing forms or modifying the flow required a lot of work. In addition, failures in the data hub spread to the sites: users received errors and could lose records.

The intervention had to address an emergency and, in principle, be temporary. From experience, I knew that a provisional solution could last for years. That's why I prepared a base capable of growing while solving the immediate need.

## My involvement

I built almost all of the initial solution, using SailsJS for the API and Node.js for the rest of the components. When it expanded to new markets and features, other developers contributed changes. Currently, I am the sole developer maintaining the system, supported by AI for development work.

## Solution and decisions

I organized Pipila as a modular system. I separated asynchronous processing into workers to facilitate flow changes and moved the appropriate configuration to environment variables, so the solution could adapt to new environments without rebuilding from scratch.

The main decision was to decouple the reception of records from the availability of the data hub. When this fails, Pipila preserves the records as pending and performs periodic retries until recovery. An internal cache helps continue serving clients during these interruptions. The interface thus no longer directly depends on each response from the external service.

Over time, two new data hubs, session control, and login flows via OpenID Connect (OIDC) were added. This evolution preserves the original purpose: to facilitate changes and integrations on a base that can be adapted.

## Results

The solution facilitated the gradual exit from the previous platform and gave greater flexibility to the development of user experiences. I observed a decrease in development effort and cost, and a significant reduction in service outages. These are qualitative results of the operation; I do not have published measurements here that would allow expressing them as percentages.

## Learning

Resolving an urgency also requires thinking about what will happen afterward. Modularity, configuration, and separation of processing allowed a temporary intervention to evolve without losing its original purpose.
