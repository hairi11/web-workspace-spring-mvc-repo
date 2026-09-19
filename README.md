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
    │       ├── java/com/company/web/fx/
    │       │   ├── controller/
    │       │   │   ├── FxPageController.java
    │       │   │   └── FxApiController.java
    │       │   └── service/
    │       │       ├── FxRestClient.java
    │       │       └── FxJsonCaseConverter.java
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
    ├── fc-module/
    │   ├── pom.xml
    │   ├── package.json
    │   ├── build.mjs
    │   ├── dev.mjs
    │   └── src/main/
    │       ├── java/com/company/web/fc/controller/
    │       │   └── FcPageController.java
    │       └── resources/
    │           ├── fc/
    │           │   ├── FcPage.js
    │           │   ├── vendor.js
    │           │   ├── action/
    │           │   ├── controller/
    │           │   └── form/
    │           └── META-INF/resources/WEB-INF/views/fc/
    │               └── enquiry.jsp
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

`fx-module` and `fc-module` each own their complete feature stack. `fx-module` currently contains the full FX implementation, while `fc-module` contains a basic FC enquiry scaffold.

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
GET /module-web/fc/enquiry
```

Legacy `.html` FX URLs redirect to the extensionless Spring MVC routes.

## Runtime flow

```text
Page request
    ↓
FxPageController
    ↓
JSP + fx.js
    ↓
/fx/api/* (Spring MVC)
    ↓
FxApiController
    ↓
FxRestClient
    ↓
REST API at http://localhost:8080/api
```

The browser no longer calls the REST service directly. Only Java code in `FxRestClient` calls:

```text
http://localhost:8080/api
```

FX REST responsibilities are split deliberately:

| Concern | Browser | Java |
| --- | --- | --- |
| UI cache / request dedupe | Ajax.js | - |
| Browser request cancellation | Ajax.js | - |
| Backend connect/read timeout | - | FxRestClient |
| Retry transient backend GET failures | - | FxRestClient |
| Retry POST/save/submit/delete | - | Never automatic |
| camelCase ↔ snake_case JSON | - | FxJsonCaseConverter |
| Backend error normalization | - | FxRestClient |
| Backend request body limit | - | FxRestClient |
| Arbitrary browser headers forwarded to backend | - | Blocked by default |

Java-side defaults can be overridden with JVM system properties:

```text
-Dfx.api.base-url=http://host:port/api
-Dfx.api.connect-timeout-ms=3000
-Dfx.api.read-timeout-ms=10000
-Dfx.api.get-attempts=2
-Dfx.api.retry-delay-ms=250
-Dfx.api.max-body-length=2000000
```

POST requests are intentionally not retried automatically because save, submit and delete operations can have side effects.

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
      ├── fc-module
      │      └── builds fc.js into its own JAR
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
http://localhost:8081/module-web/fc/enquiry
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

## FC module development

```bat
cd module-web\fc-module
npm install
npm run dev
```

FC JavaScript source lives under `src/main/resources/fc` and bundles to:

```text
target/classes/META-INF/resources/fc/fc.js
```
