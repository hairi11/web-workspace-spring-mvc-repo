<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
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
        <c:choose>
            <c:when test="${not empty detail}">
                <c:forEach items="${detail}" var="field">
                    <div class="form-group view-detail-field">
                        <label>${fn:replace(field.key, '_', ' ')}</label>
                        <input
                            type="text"
                            value="<c:out value="${field.value}"/>"
                            readonly>
                    </div>
                </c:forEach>
            </c:when>
            <c:otherwise>
                <div class="view-detail-message">No detail available.</div>
            </c:otherwise>
        </c:choose>
    </div>

    <div class="button-bar">
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fc/enquiry">Back</a>
    </div>
</main>
<script src="${pageContext.request.contextPath}/assets/vendor.js"></script>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
