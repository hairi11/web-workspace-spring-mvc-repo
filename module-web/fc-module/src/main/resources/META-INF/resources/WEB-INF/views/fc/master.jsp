<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FC Master</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/module-web.css">
</head>
<body data-page="master" data-context-path="${pageContext.request.contextPath}">
<main>
    <nav>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/">Modules</a>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fc/enquiry">FC Enquiry</a>
    </nav>

    <h1>FC Master</h1>

    <form id="fcMasterForm">
        <div class="toolbar">
            <button class="btn btn-outline-secondary"
                    id="addTransactionButton"
                    type="button">
                Add Transaction
            </button>
        </div>

        <div class="table-responsive">
            <table id="fcMasterTable">
                <caption>FC transactions</caption>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Date</th>
                        <th>FC Code</th>
                        <th>FX Code</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </form>
</main>
<script src="${pageContext.request.contextPath}/fc/FieldTranslator.local.js"></script>
<script src="${pageContext.request.contextPath}/assets/vendor.js"></script>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
