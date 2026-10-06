## Context and problem

Companies had been working with Crescendo, a solution based on Clipper, for nearly thirty years. Its limitations for operating on a network and problems with file corruption and integrity in DBASE files affected daily operations. One person had to run audit and data correction processes every night.

I was hired in 2

## My involvement

I was the sole developer during the initial construction of Onix. Toward the end, personnel was added to maintain it. The system covers purchases, sales, finance, logistics, billing, warranties, and cost accounting, and continues to serve the six companies in the corporate group.

Years later, I was contacted to modernize it. I carried out the full code migration and prepared the infrastructure. The two developers who currently maintain the system handle the incidents reported by users during testing.

## Solution and transition

I used MariaDB as the database and incorporated a DBASE connector that allowed reading the DBF files from Crescendo during migration. In the first company, both systems coexisted briefly. For the following ones, a direct migration was opted for.

During that integration, I found an error in the connector and collaborated in its correction. It was a concrete contribution to a tool on which the project depended, not a modification of the MariaDB core.

## Current modernization

The first phase included planning, dockerization, and preparation of the development environment. In the second phase, I migrated the code from Zend 1.5 to Laminas and deployed a user acceptance testing (UAT) environment in AWS, with automated horizontal scaling and a continuous integration and deployment process.

The migrated code is in testing: users send observations and the team fixes the issues found. The new billing system based on SQS still needs to be validated. Through LORO, a methodology of work with AI has also been incorporated to expand the developers' capacity to support the system.

A third phase includes a new interface and AI agents for users. It is a planned evolution, not a functionality already delivered.

## Results and learning

Onix allowed working in network, reducing manual processes, improving data integrity, and adding new processes with greater flexibility. Its continuity also demonstrates the importance of maintaining a solution beyond its initial delivery.

Returning to the project years later allows reviewing decisions from another perspective: what remains useful, what needs to change, and how to modernize it without confusing a technical migration with the end of validation work.
