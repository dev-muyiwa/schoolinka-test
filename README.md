# **Schoolinka Blogging API Documentation**

The Schoolinka Blogging API empowers users to perform CRUD (Create, Read, Update, Delete) operations on blogs. This API simplifies the process of managing and interacting with blog data. Below is an overview of the available endpoints and their functionalities.

## **Technologies**
- Typescript
- Node.js + Express.js
- PostgresDB
- Sequelize ORM


## **Overview of Endpoints**

- **Authentication:** Handle user registration, login, and logout securely. Obtain authentication tokens for accessing protected endpoints.

- **Blogs:** Perform CRUD operations on blogs. Create, retrieve, update, and delete blog posts.

- **Users:** Retrieve and manage user profiles, including account settings and profile information.

## **How to run**

- Clone repository from GitHub to your local machine.
- Set up your Postgres database.
- Duplicate the `.env.example` and rename it to `.env`. Add the `DB_HOST`, `DB_PORT`, `DB_NAME`,`DB_USER` and `DB_PASSWORD` values to the `.env`.
- Connect to your database using pgAdmin4.
- Run your project with `npm run dev`.

## **Documentation**

Link to Postman collection can be found here: [documentation](https://elements.getpostman.com/redirect?entityId=27609993-c74231f4-d8ae-44d6-acce-d0336efce04b&entityType=collection)

Link to Railway deployment: [hosting service](https://schoolinka-test-production.up.railway.app/)
