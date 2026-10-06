## Background: a platform with limitations

In 2020 we worked on a campaign whose journey included a game and an experience that had to be executed on an authorized platform. During the review, several functions were flagged as incompatible with its capabilities.

The platform allowed adding custom CSS and JavaScript. I created a tool to copy the generated HTML and use it as a local development template. The team built the application on that basis and I prepared the minified code to incorporate it through the available fields. This way we managed to integrate the planned journey using the platform's extension mechanisms.

The team, which was around four people at the time, carried out the deployment with my remote guidance. That delivery strengthened the relationship with the client and led to more projects.

## The need for Winner

The client of these campaigns was Reckitt.

In 2022, just before the launch of another campaign, the client ended the contract with the platform and ordered to stop related projects. To preserve the campaign we built Winner in a week.

I recycled part of a previous project developed with Laminas API Tools, added a Laravel service and hosted the solution on AWS. It was my first experience using ECS. I personally carried out the deployment of this new platform.

## Scope and evolution

The first version covered the campaign's journey: form presentation and games, data collection and metrics. The campaign was able to launch on time.

As with other solutions born out of urgency, I prepared a base that could continue to be used. Winner was used in more campaigns and later incorporated a chatbot and integrations with external services, such as customer data platforms (CDP).

## Results and learning

The reuse of components and integration of services allowed responding to the withdrawal of an external dependency without losing the launch date. Afterwards, the platform supported new campaigns until the client stopped investing in games and prizes.

The case includes two learnings: examining the real possibilities of a platform before discarding an experience and designing a viable exit when conditions change abruptly.
