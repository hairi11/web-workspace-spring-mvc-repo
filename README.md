# Web Workspace - WAR + npm Development

## Structure

```text
web-workspace/
├── pom.xml
├── common-js-web/
│   ├── pom.xml
│   ├── package.json
│   ├── src/
│   ├── test/
│   └── docs/
└── module-web/
    ├── pom.xml
    ├── fx-module/
    │   ├── pom.xml
    │   └── src/
    └── webapp/
        ├── pom.xml
        ├── package.json
        ├── build.mjs
        ├── build-common.mjs
        ├── dev.mjs
        └── src/
```

`fx-module` contains the feature source.

`webapp` is the only WAR, so runtime has one context path:

```text
/module-web/
└── fx/
```

## Development using npm

Go to:

```bat
cd module-web\webapp
```

Install once:

```bat
npm install
```

Start development mode:

```bat
npm run dev
```

Open:

```text
http://localhost:3000/module-web/
http://localhost:3000/module-web/fx/enquiry.html
```

`npm run dev` provides esbuild watch, HTML/CSS source watching, automatic rebuild, and BrowserSync reload.

Edit source files directly in:

```text
module-web/fx-module/src/
module-web/webapp/src/
```

Do not edit generated files under `webapp/dist`.

## Static npm serve without watch

```bat
npm run build
npm run serve
```

Then open:

```text
http://localhost:3000/module-web/
```

## Build WAR using Maven

Requirements used by this workspace:

```text
JDK 17
Maven 3.5.4+
Node 24 LTS
npm 11+
```

If Node is installed somewhere else:

```bat
mvn clean package -Dnode.home="D:\Tools\nodejs"
```

From the workspace root:

```bat
mvn clean package
```

Maven reactor:

```text
common-js-web
      ↓
module-web
      ├── fx-module
      └── webapp
             ↓
        module-web.war
```

WAR output:

```text
module-web\webapp\target\module-web.war
```

Deploy that WAR to Tomcat and open:

```text
http://localhost:8080/module-web/
http://localhost:8080/module-web/fx/enquiry.html
```
