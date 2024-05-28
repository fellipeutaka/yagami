[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Yagami&uri=https%3A%2F%2Fraw.githubusercontent.com%2Ffellipeutaka%2Fyagami%2Fmain%2F.github%2Fassets%2Finsomnia.json)

## FRs (Functional requirements)

- [x] It should be possible to register;
- [x] It should be possible to authenticate;
- [x] It should be possible to obtain the profile of a logged in user;
- [x] It should be possible to list all homeworks;
- [x] It should be possible to add a new homework;
- [x] It should be possible to edit a homework;
- [x] It should be possible to delete a homework;
- [x] It should be possible to mark a homework as completed;

## BRs (Business Rules)

- [x] The user must not be able to register with a duplicate email;

## NFRs (Non-Functional Requirements)

- [x] The user's password must be encrypted;
- [x] Application data must be persisted in a PostgreSQL database;
- [x] All data lists must be paginated using cursor-based pagination;
- [x] The user must be identified by a [JWT (JSON Web Token)](https://jwt.io/introduction);