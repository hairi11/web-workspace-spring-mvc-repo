<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.springframework.web.util.HtmlUtils" %>
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
<%
    Map<String, Object> detail =
            (Map<String, Object>) request.getAttribute("detail");

    if (detail != null && !detail.isEmpty()) {
        for (Map.Entry<String, Object> field : detail.entrySet()) {
            String label =
                    field.getKey()
                            .replace('_', ' ');

            String value =
                    field.getValue() == null
                            ? ""
                            : String.valueOf(field.getValue());
%>
        <div class="form-group view-detail-field">
            <label><%= HtmlUtils.htmlEscape(label) %></label>
            <input
                type="text"
                value="<%= HtmlUtils.htmlEscape(value) %>"
                readonly>
        </div>
<%
        }
    } else {
%>
        <div class="view-detail-message">No detail available.</div>
<%
    }
%>
    </div>

    <div class="button-bar">
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fc/enquiry">Back</a>
    </div>
</main>
<script src="${pageContext.request.contextPath}/assets/vendor.js"></script>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
