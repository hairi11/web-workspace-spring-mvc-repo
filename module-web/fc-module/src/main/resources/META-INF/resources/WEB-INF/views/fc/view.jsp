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

    <section class="view-panel">
        <h2 class="view-panel-title">Details</h2>

        <div class="view-panel-body">
            <div class="view-detail-row">
                <div class="view-detail-label">Date 2</div>
                <div id="dateValue2" class="view-detail-value"></div>
            </div>

            <div class="view-detail-row">
                <div class="view-detail-label">String 11</div>
                <div id="stringValue11" class="view-detail-value"></div>
            </div>

            <div class="view-detail-row">
                <div class="view-detail-label">Amount 2</div>
                <div id="amountValue2" class="view-detail-value"></div>
            </div>

            <div class="view-detail-row">
                <div class="view-detail-label">Amount</div>
                <div id="amountValue" class="view-detail-value"></div>
            </div>
        </div>
    </section>

    <div id="viewButtonBar" class="button-bar">
        <div class="button-bar-nav">
            <a id="previousButton" class="navigator-link" href="#" aria-label="Previous" title="Previous">
                <span aria-hidden="true">&lt;&lt;</span>
                <span>Previous</span>
            </a>
            <a id="nextButton" class="navigator-link" href="#" aria-label="Next" title="Next">
                <span>Next</span>
                <span aria-hidden="true">&gt;&gt;</span>
            </a>
        </div>

        <a
            id="backButton"
            class="btn btn-outline-secondary"
            href="${pageContext.request.contextPath}/fc/enquiry">
            Back
        </a>
    </div>
</main>
<script src="${pageContext.request.contextPath}/assets/vendor.js"></script>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
