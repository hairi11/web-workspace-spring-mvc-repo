<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FC Transaction</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/module-web.css">
</head>
<body data-page="transaction" data-context-path="${pageContext.request.contextPath}">
<main>
    <nav>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/">Modules</a>
        <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fc/enquiry">FC Enquiry</a>
    </nav>

    <h1>FC Transaction</h1>

    <form id="transactionForm" novalidate>
        <div class="form-grid">
            <div class="form-group">
                <label for="stringValue1">String 1</label>
                <input id="stringValue1" name="string_value_1" class="form-control" type="text" maxlength="30">
            </div>

            <div class="form-group">
                <label for="stringValue2">String 2</label>
                <input id="stringValue2" name="string_value_2" class="form-control" type="text" maxlength="30">
            </div>

            <div class="form-group">
                <label for="stringValue3">String 3</label>
                <select
                    id="stringValue3"
                    name="string_value_3"
                    class="form-control"
                    data-field="string_value_3">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue4">String 4</label>
                <select
                    id="stringValue4"
                    name="string_value_4"
                    class="form-control"
                    data-field="string_value_4">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue5">String 5</label>
                <select
                    id="stringValue5"
                    name="string_value_5"
                    class="form-control"
                    data-field="string_value_5">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue6">String 6</label>
                <select
                    id="stringValue6"
                    name="string_value_6"
                    class="form-control"
                    data-field="string_value_6">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue7">String 7</label>
                <select
                    id="stringValue7"
                    name="string_value_7"
                    class="form-control"
                    data-field="string_value_7">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue8">String 8</label>
                <select
                    id="stringValue8"
                    name="string_value_8"
                    class="form-control"
                    data-field="string_value_8">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue9">String 9</label>
                <select
                    id="stringValue9"
                    name="string_value_9"
                    class="form-control"
                    data-field="string_value_9">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue10">String 10</label>
                <select
                    id="stringValue10"
                    name="string_value_10"
                    class="form-control"
                    data-field="string_value_10">
                </select>
            </div>

            <div class="form-group">
                <label for="dateValue1">Date 1</label>
                <select
                    id="dateValue1"
                    name="date_value_1"
                    class="form-control"
                    data-field="date_value_1">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue11">String 11</label>
                <select
                    id="stringValue11"
                    name="string_value_11"
                    class="form-control"
                    data-field="string_value_11">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue12">String 12</label>
                <select
                    id="stringValue12"
                    name="string_value_12"
                    class="form-control"
                    data-field="string_value_12">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue13">String 13</label>
                <select
                    id="stringValue13"
                    name="string_value_13"
                    class="form-control"
                    data-field="string_value_13">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue14">String 14</label>
                <select
                    id="stringValue14"
                    name="string_value_14"
                    class="form-control"
                    data-field="string_value_14">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue15">String 15</label>
                <select
                    id="stringValue15"
                    name="string_value_15"
                    class="form-control"
                    data-field="string_value_15">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue16">String 16</label>
                <select
                    id="stringValue16"
                    name="string_value_16"
                    class="form-control"
                    data-field="string_value_16">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue17">String 17</label>
                <select
                    id="stringValue17"
                    name="string_value_17"
                    class="form-control"
                    data-field="string_value_17">
                </select>
            </div>

            <div class="form-group">
                <label for="amountValue">Amount</label>
                <select
                    id="amountValue"
                    name="amount_value"
                    class="form-control"
                    data-field="amount_value">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue18">String 18</label>
                <select
                    id="stringValue18"
                    name="string_value_18"
                    class="form-control"
                    data-field="string_value_18">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue19">String 19</label>
                <select
                    id="stringValue19"
                    name="string_value_19"
                    class="form-control"
                    data-field="string_value_19">
                </select>
            </div>

            <div class="form-group">
                <label for="integerValue">Integer</label>
                <select
                    id="integerValue"
                    name="integer_value"
                    class="form-control"
                    data-field="integer_value">
                </select>
            </div>

            <div class="form-group">
                <label for="dateValue2">Date 2</label>
                <select
                    id="dateValue2"
                    name="date_value_2"
                    class="form-control"
                    data-field="date_value_2">
                </select>
            </div>

            <div class="form-group">
                <label for="amountValue2">Amount 2</label>
                <select
                    id="amountValue2"
                    name="amount_value_2"
                    class="form-control"
                    data-field="amount_value_2">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue20">String 20</label>
                <select
                    id="stringValue20"
                    name="string_value_20"
                    class="form-control"
                    data-field="string_value_20">
                </select>
            </div>

            <div class="form-group">
                <label for="amountValue3">Amount 3</label>
                <select
                    id="amountValue3"
                    name="amount_value_3"
                    class="form-control"
                    data-field="amount_value_3">
                </select>
            </div>

            <div class="form-group">
                <label for="amountValue4">Amount 4</label>
                <select
                    id="amountValue4"
                    name="amount_value_4"
                    class="form-control"
                    data-field="amount_value_4">
                </select>
            </div>

            <div class="form-group">
                <label for="amountValue5">Amount 5</label>
                <select
                    id="amountValue5"
                    name="amount_value_5"
                    class="form-control"
                    data-field="amount_value_5">
                </select>
            </div>

            <div class="form-group">
                <label for="amountValue6">Amount 6</label>
                <select
                    id="amountValue6"
                    name="amount_value_6"
                    class="form-control"
                    data-field="amount_value_6">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue21">String 21</label>
                <select
                    id="stringValue21"
                    name="string_value_21"
                    class="form-control"
                    data-field="string_value_21">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue22">String 22</label>
                <select
                    id="stringValue22"
                    name="string_value_22"
                    class="form-control"
                    data-field="string_value_22">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue23">String 23</label>
                <select
                    id="stringValue23"
                    name="string_value_23"
                    class="form-control"
                    data-field="string_value_23">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue24">String 24</label>
                <select
                    id="stringValue24"
                    name="string_value_24"
                    class="form-control"
                    data-field="string_value_24">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue25">String 25</label>
                <select
                    id="stringValue25"
                    name="string_value_25"
                    class="form-control"
                    data-field="string_value_25">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue26">String 26</label>
                <select
                    id="stringValue26"
                    name="string_value_26"
                    class="form-control"
                    data-field="string_value_26">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue27">String 27</label>
                <select
                    id="stringValue27"
                    name="string_value_27"
                    class="form-control"
                    data-field="string_value_27">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue28">String 28</label>
                <select
                    id="stringValue28"
                    name="string_value_28"
                    class="form-control"
                    data-field="string_value_28">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue29">String 29</label>
                <select
                    id="stringValue29"
                    name="string_value_29"
                    class="form-control"
                    data-field="string_value_29">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue30">String 30</label>
                <select
                    id="stringValue30"
                    name="string_value_30"
                    class="form-control"
                    data-field="string_value_30">
                </select>
            </div>

            <div class="form-group">
                <label for="dateValue3">Date 3</label>
                <select
                    id="dateValue3"
                    name="date_value_3"
                    class="form-control"
                    data-field="date_value_3">
                </select>
            </div>

            <div class="form-group">
                <label for="dateValue4">Date 4</label>
                <select
                    id="dateValue4"
                    name="date_value_4"
                    class="form-control"
                    data-field="date_value_4">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue31">String 31</label>
                <select
                    id="stringValue31"
                    name="string_value_31"
                    class="form-control"
                    data-field="string_value_31">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue32">String 32</label>
                <select
                    id="stringValue32"
                    name="string_value_32"
                    class="form-control"
                    data-field="string_value_32">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue33">String 33</label>
                <select
                    id="stringValue33"
                    name="string_value_33"
                    class="form-control"
                    data-field="string_value_33">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue34">String 34</label>
                <select
                    id="stringValue34"
                    name="string_value_34"
                    class="form-control"
                    data-field="string_value_34">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue35">String 35</label>
                <select
                    id="stringValue35"
                    name="string_value_35"
                    class="form-control"
                    data-field="string_value_35">
                </select>
            </div>

            <div class="form-group">
                <label for="stringValue36">String 36</label>
                <input id="stringValue36" name="string_value_36" class="form-control" type="text" maxlength="2000">
            </div>

            <div class="form-group">
                <label for="stringValue37">String 37</label>
                <input id="stringValue37" name="string_value_37" class="form-control" type="text" maxlength="255">
            </div>

            <div class="form-group">
                <label for="stringValue38">String 38</label>
                <input id="stringValue38" name="string_value_38" class="form-control" type="text" maxlength="16">
            </div>

            <div class="form-group">
                <label for="dateValue5">Date 5</label>
                <input id="dateValue5" name="date_value_5" class="form-control" type="text">
            </div>

            <div class="form-group">
                <label for="amountValue7">Amount 7</label>
                <input id="amountValue7" name="amount_value_7" class="form-control" type="text">
            </div>

            <div class="form-group">
                <label for="dateValue6">Date 6</label>
                <input id="dateValue6" name="date_value_6" class="form-control" type="text">
            </div>
        </div>

        <div class="button-bar">
            <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/fc/enquiry">Cancel</a>
        </div>
    </form>
</main>
<script src="${pageContext.request.contextPath}/fc/FieldTranslator.local.js"></script>
<script src="${pageContext.request.contextPath}/assets/vendor.js"></script>
<script src="${pageContext.request.contextPath}/fc/fc.js"></script>
</body>
</html>
