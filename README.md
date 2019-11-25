**Library-app**

*****Lunatech’s Library application*****

*This backend provides a service for the administration of books and their lend-outs.*


**Resources**

Github:				`https://github.com/lunatech-labs/lunatech-library-app`

clever cloud: `http://library.lunatech.com/`

swagger-ui:		`<base-url>/swagger-ui.html`


**Environment variables**

•	`GOOGLE_OAUTH2_CLIENT_ID`

The client-id provided by Google. The string I am looking at is 72 characters long and ends with “apps.googleusercontent.com”.

•	`GOOGLE_OAUTH2_CLIENT_SECRET`

The secret provided by Google. This string is 24 characters long.

•	`POSTGRES_DATASOURCE_URL`

The url to get access to the postgress database. 

•	`POSTGRES_DATASOURCE_USERNAME`

•	`POSTGRES_DATASOURCE_PASSWORD`


**Authentication**

The authentication takes place via google Oauth. Note that only emails from lunatech-domains (fr,be,nl) are allowed.

**Technical**

This backend is made with Java, Spring Boot, JPA, Hibernate, Swagger. The data is persisted in a Post-gres database, unit tests take place in a volatile H2 database.

**Setup**

•	Import the repository in your favorite IDE (IntelliJ, Eclipse, etc).

•	In Google Cloud Console obtain an Api key and activate Oauth 2 to get a Client Id and a secret

•	Install Postgres

•	In your workstation, or better in your IDE administer the environment variables

**Documentation**

See the swagger-ui for the endpoints and model.


