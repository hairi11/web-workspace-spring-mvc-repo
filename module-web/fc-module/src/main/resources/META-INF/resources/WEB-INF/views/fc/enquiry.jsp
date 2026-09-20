<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FC Enquiry</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/module-web.css">
</head>
<body data-page="enquiry" data-context-path="${pageContext.request.contextPath}">
<main>
    <nav>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/">Modules</a>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fc/enquiry">FC Enquiry</a>
    </nav>

    <h1>FC Enquiry</h1>

    <div class="toolbar">
        <input id="searchInput" type="search" placeholder="Search FC record" aria-label="Search FC record">
        <button class="btn btn-outline-secondary" id="reloadButton" type="button">Reload</button>
    </div>

    <table id="fcTable">
        <caption>FC enquiry records</caption>
        <thead>
            <tr>
                <th>Record No</th>
                <th>Category</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</main>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
