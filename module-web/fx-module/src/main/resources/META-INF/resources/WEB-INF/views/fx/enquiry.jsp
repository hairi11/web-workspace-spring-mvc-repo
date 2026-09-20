<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FX Enquiry</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/module-web.css">
</head>
<body data-page="enquiry" data-context-path="${pageContext.request.contextPath}">
<main>
    <nav>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/">Modules</a>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fx/enquiry">FX Enquiry</a>
    </nav>

    <h1>FX Enquiry</h1>

    <div class="toolbar">
        <input id="searchInput" type="search" placeholder="Search FX record" aria-label="Search FX record">
        <button class="btn btn-outline-secondary" id="reloadButton" type="button">Reload</button>
    </div>

    <div class="datatable-action-toolbar" aria-label="FX table actions">
        <div class="datatable-action-toolbar-left">
            <button class="btn datatable-action-button" id="viewFxButton" type="button" disabled>
                <i class="fa fa-eye" aria-hidden="true"></i>
                <span>View</span>
            </button>
            <button class="btn datatable-action-button" id="editFxButton" type="button" disabled>
                <i class="fa fa-pen" aria-hidden="true"></i>
                <span>Edit</span>
            </button>
            <button class="btn datatable-action-button datatable-action-button-danger" id="deleteFxButton" type="button" disabled>
                <i class="fa fa-trash" aria-hidden="true"></i>
                <span>Delete</span>
            </button>
        </div>
        <div class="datatable-action-toolbar-right">
            <button class="btn datatable-action-button datatable-action-button-primary" id="createFxButton" type="button">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>Create</span>
            </button>
        </div>
    </div>

    <table id="fxTable">
        <caption>FX enquiry records</caption>
        <thead>
            <tr>
                <th>Report Date</th>
                <th>Record No</th>
                <th>FX Category</th>
                <th>FX Code</th>
                <th>FX Type</th>
                <th>FX Amount</th>
                <th>FX Date</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</main>
<script src="${pageContext.request.contextPath}/fx/fx.js"></script>
</body>
</html>
