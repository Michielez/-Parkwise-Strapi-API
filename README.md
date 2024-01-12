
# Deploying Parkwise Strapi API on DigitalOcean with PostgreSQL Database

This guide provides step-by-step instructions for deploying the Parkwise Strapi API on DigitalOcean using a PostgreSQL database. For a visual aid, consider watching this helpful video on deploying Strapi to DigitalOcean: [Strapi Deployment Video](https://www.youtube.com/watch?v=tnGqqUzzh6U&list=PL7Q0DQYATmvjJyxrLw0xCOKwjv8Bh7yLx&index=13&ab_channel=Strapi).

## Step 1: Set Up Production Database Environment

- Create a file at `config/env/production/database.js`.
- Insert the following default template. Note: These values will be overridden by DigitalOcean's environment variables:

  ```javascript
  module.exports = ({ env }) => ({
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', '172.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        schema: env('DATABASE_SCHEMA', 'public'),
        ssl: {
          ca: env('DATABASE_CA')
        }
      },
      debug: false
    }
  });
  ```

## Step 2: Push Code to GitHub/GitLab

- Ensure your entire codebase, including the above configuration, is pushed to GitHub or GitLab. DigitalOcean integrates seamlessly with these services to fetch your code.

## Step 3: Deploy on DigitalOcean

### A. Get Your Code

1. Visit [DigitalOcean](https://cloud.digitalocean.com/) and select 'Create App'.
2. Choose your code repository provider and authorize DigitalOcean to access your repository if prompted.
3. Select the repository and branch for deployment.
4. Leave the Source Directory as the root (`/`) unless your project structure requires otherwise.
5. Optionally enable 'Autodeploy' for automatic server updates with each new push, without affecting the database.

### B. Choose Your Resources

1. Edit Web Service settings:  
  Set the HTTP Port to 1337 (Strapi's default port).
1. Add a Database Resource:  
  Choose PostgreSQL and use the default options.
1. Edit your plan:  
  Opt for the Basic plan for cost-effectiveness, with a 512MB RAM and 1 vCPU instance. Adjust according to your performance needs.

### C. Configure Environment Variables

1. In the DigitalOcean app settings, click on your Strapi application (not global settings).
2. Use the 'bulk editor' for efficiency.
3. Add the following variables (obtain values like `APP_KEYS`, `JWT_SECRET`, etc., from your repo's `.env` file):

   ```ini
   DATABASE_NAME=${db.DATABASE}
   DATABASE_USERNAME=${db.USERNAME}
   DATABASE_PASSWORD=${db.PASSWORD}
   DATABASE_PORT=${db.PORT}
   DATABASE_HOST=${db.HOSTNAME}
   DATABASE_CA=${db.CA_CERT}
   APP_KEYS=<Your_App_Keys>
   JWT_SECRET=<Your_JWT_Secret>
   API_TOKEN_SALT=<Your_Token_Salt>
   NODE_ENV=production
   ADMIN_JWT_SECRET=<Your_Admin_JWT_Secret>
   ```

4. Save these environment variables.

### D. Finalize and Deploy

1. Choose your app name, project, and the region closest to your target audience.
2. Review all configurations.
3. Click 'Create Resource' to initiate the deployment.
4. Deployment may take up to 10 minutes. Upon successful deployment, you'll see a green checkmark.

You can now access your Strapi API and admin page via the provided URL on DigitalOcean.
