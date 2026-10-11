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
            <label for="date_value_6_from">Date From</label>
            <input
                id="date_value_6_from"
                name="date_value_6_from"
                type="text"
                autocomplete="off" data-control="date">
        </div>
        <div class="form-group">
            <label for="date_value_6_to">Date To</label>
            <input
                id="date_value_6_to"
                name="date_value_6_to"
                type="text"
                autocomplete="off" data-control="date">
        </div>
        <div class="form-group">
            <label for="string_value_33">FC Code</label>
            <select
                id="string_value_33"
                name="string_value_33"
                aria-label="FC code"
                disabled data-control="select" data-parameter="string_value_33" data-placeholder="Select FC code" data-allow-clear="true">
                <option value="">Loading FC codes...</option>
            </select>
        </div>
        <div class="form-group">
            <label for="string_value_35">FX Code</label>
            <select
                id="string_value_35"
                name="string_value_35"
                aria-label="FX code"
                disabled data-control="select" data-parameter="string_value_35" data-placeholder="Select FX code" data-allow-clear="true">
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
