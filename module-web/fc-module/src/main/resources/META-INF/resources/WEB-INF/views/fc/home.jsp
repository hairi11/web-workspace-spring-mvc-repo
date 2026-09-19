<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FC Module</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/module-web.css">
</head>
<body data-page="home">
<main>
    <nav>
        <a class="button" href="${pageContext.request.contextPath}/">Modules</a>
        <a class="button" href="${pageContext.request.contextPath}/fc/home">FC Home</a>
    </nav>

    <h1>FC Module</h1>
    <p id="fcStatus">Loading FC module...</p>
</main>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
