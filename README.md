# Web Workspace - Spring MVC WAR + npm Frontend

## Structure

```text
web-workspace/
├── pom.xml
├── common-js-web/
│   ├── pom.xml
│   ├── package.json
│   └── src/
└── module-web/
    ├── pom.xml
    ├── fx-module/
    │   ├── pom.xml
    │   └── src/
    │       ├── FxPage.js
    │       ├── action/
    │       ├── controller/
    │       ├── form/
    │       ├── main/java/com/company/web/fx/controller/
    │       │   └── FxPageController.java
    │       └── pages/
    │           ├── enquiry.jsp
    │           ├── master.jsp
    │           └── transaction.jsp
    └── webapp/
        ├── pom.xml
        ├── package.json
        ├── build.mjs
        ├── build-common.mjs
        ├── dev.mjs
        └── src/
            ├── main/
            │   ├── java/com/company/web/
            │   │   ├── config/
            │   │   └── controller/
            │   │       └── HomeController.java
            │   └── webapp/WEB-INF/views/home.jsp
            ├── js/
            ├── styles/
            └── module-web.css
```

## Spring MVC routes

```text
GET /module-web/
GET /module-web/fx/enquiry
GET /module-web/fx/master
GET /module-web/fx/transaction
```

Legacy `.html` FX URLs redirect to the Spring MVC routes.

The page flow is now:

```text
HTTP request
    ↓
DispatcherServlet
    ↓
Spring MVC Controller
    ↓
JSP under WEB-INF/views
    ↓
fx.js + common-js-web
    ↓
REST API at http://localhost:8080/api
```

## Build WAR

Requirements:

```text
JDK 17
Maven 3.5.4+
Node 22
npm 10+
```

From the workspace root:

```bat
mvn clean package
```

The npm/esbuild build runs during Maven `generate-resources`.

WAR output:

```text
module-web\webapp\target\module-web.war
```

## Run locally with Jetty

The REST service remains on port `8080`. The web application uses port `8081` locally to avoid a port collision.

From `module-web\webapp`:

```bat
mvn generate-resources compile jetty:run
```

Open:

```text
http://localhost:8081/module-web/
http://localhost:8081/module-web/fx/enquiry
```

## Frontend live reload

Start the Spring MVC application first on port `8081`, then in another terminal from `module-web\webapp`:

```bat
npm run dev
```

BrowserSync proxies the Spring MVC application at:

```text
http://localhost:3000/module-web/
```

JavaScript, CSS and JSP source changes are rebuilt/reloaded automatically.

Do not edit generated files under `module-web/webapp/dist`.
