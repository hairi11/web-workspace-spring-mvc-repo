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

    <h1>FC Detail</h1>

    <div class="view-detail-grid">
        <div class="form-group view-detail-field">
            <label for="stringValue1">String 1</label>
            <input id="stringValue1" type="text" readonly>
        </div>

        <div class="form-group view-detail-field">
            <label for="stringValue2">String 2</label>
            <input id="stringValue2" type="text" readonly>
        </div>

        <div class="form-group view-detail-field">
            <label for="dateValue1">Date 1</label>
            <input id="dateValue1" type="text" readonly>
        </div>

        <div class="form-group view-detail-field">
            <label for="stringValue3">String 3</label>
            <input id="stringValue3" type="text" readonly>
        </div>

        <div class="form-group view-detail-field">
            <label for="stringValue4">String 4</label>
            <input id="stringValue4" type="text" readonly>
        </div>

        <div class="form-group view-detail-field">
            <label for="amountValue">Amount</label>
            <input id="amountValue" type="text" readonly>
        </div>

        <div class="form-group view-detail-field">
            <label for="stringValue5">String 5</label>
            <input id="stringValue5" type="text" readonly>
        </div>

        <div class="form-group view-detail-field">
            <label for="dateValue2">Date 2</label>
            <input id="dateValue2" type="text" readonly>
        </div>

        <div class="form-group view-detail-field">
            <label for="stringValue6">String 6</label>
            <input id="stringValue6" type="text" readonly>
        </div>
    </div>

    <div class="button-bar">
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fc/enquiry">Back</a>
    </div>
</main>
<script src="${pageContext.request.contextPath}/assets/vendor.js"></script>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
