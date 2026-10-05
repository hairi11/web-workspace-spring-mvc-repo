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

    <div class="form-row enquiry-criteria-row">
        <div class="form-group">
            <label for="dateFrom">Date From</label>
            <input id="dateFrom" name="dateFrom" type="text" autocomplete="off">
        </div>
        <div class="form-group">
            <label for="dateTo">Date To</label>
            <input id="dateTo" name="dateTo" type="text" autocomplete="off">
        </div>
        <div class="form-group">
            <label for="fcCodeSelect">FC Code</label>
            <select id="fcCodeSelect" aria-label="FC code" disabled>
                <option value="">Loading FC codes...</option>
            </select>
        </div>
        <div class="form-group">
            <label for="fxCodeSelect">FX Code</label>
            <select id="fxCodeSelect" aria-label="FX code" disabled>
                <option value="">Loading FX codes...</option>
            </select>
        </div>
        <div class="form-group enquiry-search-action">
            <button
                class="btn btn-outline-secondary"
                id="searchButton"
                type="button"
                aria-label="Search"
                title="Search">
                <i class="fa fa-search" aria-hidden="true"></i>
            </button>
        </div>
    </div>

    <table id="fcTable">
        <caption>FC enquiry records</caption>
        <thead>
            <tr>
                <th>String</th>
                <th>String</th>
                <th>Date</th>
                <th>String</th>
                <th>String</th>
                <th>Amount</th>
                <th>String</th>
                <th>Date</th>
                <th>String</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</main>
<script src="${pageContext.request.contextPath}/fc/FieldTranslator.local.js"></script>
<script src="${pageContext.request.contextPath}/assets/vendor.js"></script>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
