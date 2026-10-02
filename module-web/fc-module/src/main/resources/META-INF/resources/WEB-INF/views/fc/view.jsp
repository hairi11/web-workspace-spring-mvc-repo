<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FC View</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/module-web.css">
</head>
<body data-page="view" data-context-path="${pageContext.request.contextPath}">
<main>
    <nav>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/">Modules</a>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fc/enquiry">FC Enquiry</a>
    </nav>

    <h1>FC View</h1>

    <div id="viewContent">
    </div>

    <div class="button-bar">
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fc/enquiry">Back</a>
    </div>
</main>
<script src="${pageContext.request.contextPath}/assets/vendor.js"></script>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
