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

    <div class="fc-detail-layout">
        <div class="fc-detail-main">
            <section class="view-detail-panel">
                <h2 class="view-detail-panel-title">Details</h2>

                <div class="view-detail-panel-body">
                    <div class="view-detail-panel-row">
                        <div class="view-detail-panel-label">Date 2</div>
                        <div id="dateValue2" class="view-detail-value"></div>
                    </div>

                    <div class="view-detail-panel-row">
                        <div class="view-detail-panel-label">String 11</div>
                        <div id="stringValue11" class="view-detail-value"></div>
                    </div>

                    <div class="view-detail-panel-row">
                        <div class="view-detail-panel-label">Amount 2</div>
                        <div id="amountValue2" class="view-detail-value"></div>
                    </div>

                    <div class="view-detail-panel-row">
                        <div class="view-detail-panel-label">Amount</div>
                        <div id="amountValue" class="view-detail-value"></div>
                    </div>
                </div>
            </section>

            <section class="view-detail-panel">
                <h2 class="view-detail-panel-title">Additional Details</h2>

                <div class="view-detail-panel-body">
                    <div class="view-detail-panel-row">
                        <div class="view-detail-panel-label">String 12</div>
                        <div id="stringValue12" class="view-detail-value"></div>
                    </div>
                </div>
            </section>

            <div class="view-detail-grid">

                <div class="form-group view-detail-field">
                <label for="stringValue1">String 1</label>
                <div id="stringValue1" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue3">String 3</label>
                <div id="stringValue3" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue4">String 4</label>
                <div id="stringValue4" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue6">String 6</label>
                <div id="stringValue6" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue7">String 7</label>
                <div id="stringValue7" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue8">String 8</label>
                <div id="stringValue8" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue9">String 9</label>
                <div id="stringValue9" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue13">String 13</label>
                <div id="stringValue13" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue14">String 14</label>
                <div id="stringValue14" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue15">String 15</label>
                <div id="stringValue15" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="integerValue">Integer</label>
                <div id="integerValue" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue16">String 16</label>
                <div id="stringValue16" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="amountValue3">Amount 3</label>
                <div id="amountValue3" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="amountValue4">Amount 4</label>
                <div id="amountValue4" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="amountValue5">Amount 5</label>
                <div id="amountValue5" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="amountValue6">Amount 6</label>
                <div id="amountValue6" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue17">String 17</label>
                <div id="stringValue17" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue19">String 19</label>
                <div id="stringValue19" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue20">String 20</label>
                <div id="stringValue20" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue21">String 21</label>
                <div id="stringValue21" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue22">String 22</label>
                <div id="stringValue22" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue23">String 23</label>
                <div id="stringValue23" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="dateValue3">Date 3</label>
                <div id="dateValue3" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue24">String 24</label>
                <div id="stringValue24" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue26">String 26</label>
                <div id="stringValue26" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue27">String 27</label>
                <div id="stringValue27" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue28">String 28</label>
                <div id="stringValue28" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="dateValue5">Date 5</label>
                <div id="dateValue5" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="amountValue7">Amount 7</label>
                <div id="amountValue7" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="dateValue6">Date 6</label>
                <div id="dateValue6" class="view-detail-value"></div>
                </div>
            </div>
        </div>

        <aside class="fc-detail-side">
            <div class="view-detail-grid">
                <div class="form-group view-detail-field">
                <label for="stringValue2">String 2</label>
                <div id="stringValue2" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue5">String 5</label>
                <div id="stringValue5" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="dateValue1">Date 1</label>
                <div id="dateValue1" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue10">String 10</label>
                <div id="stringValue10" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue18">String 18</label>
                <div id="stringValue18" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="dateValue4">Date 4</label>
                <div id="dateValue4" class="view-detail-value"></div>
                </div>

                <div class="form-group view-detail-field">
                <label for="stringValue25">String 25</label>
                <div id="stringValue25" class="view-detail-value"></div>
                </div>
            </div>
        </aside>
    </div>

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
