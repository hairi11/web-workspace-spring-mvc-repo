# Web Workspace - Modular Spring MVC WAR

## Architecture

```text
web-workspace/
├── pom.xml
├── common-js-web/
│   ├── package.json
│   └── src/
└── module-web/
    ├── pom.xml
    ├── fx-module/
    │   ├── pom.xml
    │   ├── package.json
    │   ├── build.mjs
    │   ├── dev.mjs
    │   └── src/main/
    │       ├── java/com/company/web/fx/controller/
    │       │   └── FxPageController.java
    │       └── resources/
    │           ├── fx/
    │           │   ├── FxPage.js
    │           │   ├── FxApi.js
    │           │   ├── FxConstants.js
    │           │   ├── FxRows.js
    │           │   ├── FxService.js
    │           │   ├── vendor.js
    │           │   ├── action/
    │           │   ├── controller/
    │           │   └── form/
    │           └── META-INF/resources/
    │               └── WEB-INF/views/fx/
    │               ├── enquiry.jsp
    │               ├── master.jsp
    │               └── transaction.jsp
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
            │   │   │   ├── WebAppInitializer.java
            │   │   │   └── WebMvcConfig.java
            │   │   └── controller/
            │   │       └── HomeController.java
            │   └── webapp/WEB-INF/views/
            │       └── home.jsp
            ├── module-web.css
            └── styles/
```

## Module ownership

`fx-module` owns the complete FX feature:

- Spring MVC controller
- FX JSP views
- FX JavaScript source
- FX npm/esbuild configuration
- generated `fx.js`

`webapp` is only the Spring MVC host/WAR and shared web shell. It does not read or copy FX source files.

During the FX Maven build, esbuild writes:

```text
fx-module/target/classes/
└── META-INF/resources/
    ├── WEB-INF/views/fx/
    │   ├── enquiry.jsp
    │   ├── master.jsp
    │   └── transaction.jsp
    └── fx/
        ├── fx.js
        └── fx.js.map
```

Those files are packaged inside `fx-module.jar`. The final WAR includes that JAR under `WEB-INF/lib`.

## Spring MVC routes

```text
GET /module-web/
GET /module-web/fx/enquiry
GET /module-web/fx/master
GET /module-web/fx/transaction
```

Legacy `.html` FX URLs redirect to the extensionless Spring MVC routes.

## Runtime flow

```text
HTTP request
    ↓
DispatcherServlet
    ↓
FxPageController from fx-module.jar
    ↓
JSP from fx-module.jar/META-INF/resources/WEB-INF/views/fx
    ↓
/fx/fx.js from fx-module.jar/META-INF/resources/fx
    ↓
common-js-web + REST API
```

The REST service remains at:

```text
http://localhost:8080/api
```

## Build

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

Maven reactor order:

```text
common-js-web
      ↓
module-web
      ├── fx-module
      │      └── builds fx.js into its own JAR
      └── webapp
             └── packages module-web.war
```

WAR output:

```text
module-web\webapp\target\module-web.war
```

## Run locally with Jetty

The web application uses port `8081` locally so it does not collide with the REST service on `8080`.

Build/install the reactor first:

```bat
mvn clean install
```

Then:

```bat
cd module-web\webapp
mvn jetty:run
```

Open:

```text
http://localhost:8081/module-web/
http://localhost:8081/module-web/fx/enquiry
```

## Frontend development

FX frontend ownership is inside `fx-module`:

```bat
cd module-web\fx-module
npm install
npm run dev
```

This watches `src/main/resources/fx` and writes the FX bundle to:

```text
target/classes/META-INF/resources/fx/fx.js
```

Shared webapp CSS/resources remain in `webapp`:

```bat
cd module-web\webapp
npm install
npm run dev
```

The webapp development server uses BrowserSync as a proxy to the Spring MVC app at port `8081`.

Generated build output under `target` or `webapp/dist` must not be edited manually.
