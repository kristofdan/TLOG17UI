$(document).ready(function(){
    setCalendarCaption(new Date());
    drawAndFillTableBody(new Date());
    fillStatisticsTable();
    
    //Setting event handlers for pager
    $("#pager-previous").click(function(){
        var dateOfPreviousMonth = calculateDateOfPreviousMonth();
        deleteTableBody();
        setCalendarCaption(dateOfPreviousMonth);
        drawAndFillTableBody(dateOfPreviousMonth);
        fillStatisticsTable();
    });

    $("#pager-next").click(function(){
        var dateOfNextMonth = calculateDateOfNextMonth();
        deleteTableBody();
        setCalendarCaption(dateOfNextMonth);
        drawAndFillTableBody(dateOfNextMonth);
        fillStatisticsTable();
    });
});

function setCalendarCaption(date){
    
    var monthNames = ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"
    ];
    $("#calendar-table caption").text(date.getFullYear() + " "
            + monthNames[date.getMonth()]);
    $("#calendar-table caption").attr("id",
        date.getFullYear() + "/" + String(date.getMonth()+1));
}

function drawAndFillTableBody(date){
    var tbody = createAndFillTbody(date);
        
    $("#calendar-table").append(tbody);
}

function createAndFillTbody(date){
    var tbodySize = calculateTbodySize(date);
    var tbody = createAndFillCells(tbodySize);
    
    return tbody;
}

function calculateTbodySize(date){
    var monthLengths = [31,28,31,30,31,30,31,31,30,31,30,31];
    var firstDayOfThisMonth = date;
    firstDayOfThisMonth.setDate(1);
    if (firstDayOfThisMonth.getFullYear() % 4 === 0){
        monthLengths[2] = 29;
    }
    
    var firstRowEmptyCellNumber;
    if (firstDayOfThisMonth.getDay() === 0){
        firstRowEmptyCellNumber = 6;
    }else {
        firstRowEmptyCellNumber = firstDayOfThisMonth.getDay() - 1;
    }
    var dayNumber = monthLengths[firstDayOfThisMonth.getMonth()];
    var cellNumber = dayNumber + firstRowEmptyCellNumber;
    var rowNumber = cellNumber / 7;
    rowNumber = Math.ceil(rowNumber);
    var lastRowEmptyCellNumber = (rowNumber * 7) -
            (firstRowEmptyCellNumber + dayNumber);
    
    var tbodySize = {rowNumber: rowNumber,
        firstRowEmptyCellNumber: firstRowEmptyCellNumber,
        dayNumber: dayNumber,
        lastRowEmptyCellNumber: lastRowEmptyCellNumber
    };
    return tbodySize;
}

function createAndFillCells(tbodySize){
    var tbody = document.createElement("tbody");
    
    var firstRow = createAndFillFirstRow(tbodySize.firstRowEmptyCellNumber);
    tbody.appendChild(firstRow);
    
    var currentDay = 7 - tbodySize.firstRowEmptyCellNumber + 1;
    tbody = createMiddleRowsInTbody(tbody, tbodySize.rowNumber, currentDay);
     
    var firstDayOfLastRow = currentDay + (tbodySize.rowNumber - 2) * 7;
    var lastRow = createAndFillLastRow(firstDayOfLastRow, tbodySize.lastRowEmptyCellNumber);
    tbody.appendChild(lastRow);
    
    addWorkDayData();
    
    return tbody;
}

function createAndFillFirstRow(firstRowEmptyCellNumber){
    var currentDay = 1;
    var firstRow = document.createElement("tr");
    for (var i=0; i<firstRowEmptyCellNumber; ++i){
        var newCell = document.createElement("td");
        firstRow.appendChild(newCell);
    }
    for (var i=firstRowEmptyCellNumber; i<7; ++i){
        var newCell = createDayCell(currentDay);
        firstRow.appendChild(newCell);
        currentDay++;
    }
    return firstRow;
}

function createMiddleRowsInTbody(tbody, rowNumber, currentDay){
    for (var i=1; i<rowNumber - 1; ++i){
        var row = createFullRow(currentDay + (i-1)*7);
        tbody.appendChild(row);
    }
    return tbody;
}

function createFullRow(currentDay){
    var row = document.createElement("tr");
    for (var i = 0; i < 7; i++) {
        var newCell = createDayCell(currentDay);
        row.appendChild(newCell);
        currentDay++;
    }
    return row;
}

function createAndFillLastRow(firstDayOfLastRow, lastRowEmptyCellNumber){
    var lastRow = document.createElement("tr");
    var lastDay = firstDayOfLastRow + (7 - lastRowEmptyCellNumber - 1);
    for (var i=firstDayOfLastRow; i<=lastDay; i++){
        var newCell = createDayCell(i);
        lastRow.appendChild(newCell);
    }
    for (var i=lastDay + 1; i<=lastDay + lastRowEmptyCellNumber; i++){
        var newCell = document.createElement("td");
        lastRow.appendChild(newCell);
    }
    
    return lastRow;
}

function createDayCell(currentDay){    
    var newCell = document.createElement("td");
    newCell.id = currentDay;
    
    addOnClickHandler(newCell,currentDay);
    
    addContent(newCell,currentDay);
    
    return newCell;
}

function addOnClickHandler(newCell,currentDay){
    var dateOfDay = createDateOfCurrentMonthWithDay(currentDay);
    var isFutureDate = dateOfDay > new Date();
    if (isFutureDate){
        newCell.onclick = function(){
            window.alert("Cannot add a day later than today!");
        };
    }else {
        newCell.onclick = function(){
            createWorkDay(newCell.id);
        };
    }
}

function addContent(newCell,currentDay){
    var dayNumber = document.createTextNode(currentDay);
    var lineBreak = document.createElement("br");
    var extraMinutes = document.createElement("span");
    extraMinutes.style.fontSize = "0.8em";
    var extraMinutesText = document.createTextNode("");

    extraMinutes.appendChild(extraMinutesText);
    newCell.appendChild(dayNumber);
    newCell.appendChild(lineBreak);
    newCell.appendChild(extraMinutes);
}

function createWorkDay(dayNumber){
    //TODO: aktuálisnál későbbi napok esetén legyen alert popup!
    
    var dateOfDay = createDateOfCurrentMonthWithDay(dayNumber);
    var isNotWeekday = dateOfDay.getDay() === 0 || dateOfDay.getDay() === 6;
    
    if (isNotWeekday){
        if (window.confirm("Are you sure you want to add workday on the weekend?") === true){
            sendCreateRequestThenUpdateStatistics(dayNumber,false);
        }
    }else {
        sendCreateRequestThenUpdateStatistics(dayNumber,true);
    }
    
    
}

function sendCreateRequestThenUpdateStatistics(dayNumber,isWeekDay){
    var requiredMin = prompt("Required working minutes","450");
    if (isNaN(Number(requiredMin)) || requiredMin == null){
        alert("You need to input a number!");
    }else if(Number(requiredMin) < 0){
        alert("You need to input a non-negative number!");
    }else {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                updateCellContent(dayNumber,requiredMin);
                updateMonthlyStatistics(requiredMin);
            }
        };
        if (isWeekDay){
            request.open("POST",
            "/tlog-backend/timelogger/workmonths/workdays",
            true);
        }else {
            request.open("POST",
            "/tlog-backend/timelogger/workmonths/workdays/weekend",
            true);
        }
        request.setRequestHeader("Content-type", "application/json");
        var JSONString = prepareJSONString(requiredMin, dayNumber);
        request.send(JSONString);
    }
}

function updateCellContent(dayNumber,requiredMin){
    var cell = document.getElementById(dayNumber);
    cell.onclick = "";
    cell.style.backgroundColor = "gold";
    extraMinSpan = cell.lastChild;
    extraMinSpan.innerHTML = requiredMin * (-1);
    if (requiredMin * (-1) < 0){
        extraMinSpan.style.color = "red";
    }else {
        extraMinSpan.style.color = "green";
    }
}

function updateMonthlyStatistics(additionalRequiredMin){
    var requiredMinutesSpan = document.getElementById("required-minutes-span");
    var extraMinutesSpan = document.getElementById("extra-minutes-span");
    requiredMinutesSpan.innerHTML = Number(requiredMinutesSpan.innerHTML) +
            Number(additionalRequiredMin);
    extraMinutesSpan.innerHTML -= additionalRequiredMin;
    if (extraMinutesSpan.innerHTML < 0){
        extraMinutesSpan.parentNode.style.color = "red";
    }else {
        extraMinutesSpan.parentNode.style.color = "green";
    }
}

function prepareJSONString(requiredMin, dayNumber){
    var captionID = $("#calendar-table caption").attr("id");
    var year = Number(captionID.substr(0,4));
    var month = Number(captionID.substr(5));
    var workDayObject = {"requiredMinPerDay": requiredMin, "year":year,
        "month": month, "day": dayNumber};
    var JSONString = JSON.stringify(workDayObject);
    return JSONString;
}

function addWorkDayData(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            addResponseDataToCells(this.responseText);
        }
    };
    request.open("GET",
        "/tlog-backend/timelogger/workmonths/" +
                $("#calendar-table caption").attr("id"),
        true);
    request.send();
}

function addResponseDataToCells(responseText){
    var workDayList = JSON.parse(responseText);
    for (var i = 0; i < workDayList.length; i++) {
        var workDayCell = document.getElementById(workDayList[i].actualDay[2]);
        workDayCell.onclick = "";
        workDayCell.style.backgroundColor = "gold";
        var spanTagForExtraMin = workDayCell.lastChild;
        var extraMin = workDayList[i].extraMinPerDay;
        spanTagForExtraMin.innerHTML = extraMin;
        if (extraMin < 0){
            spanTagForExtraMin.style.color = "red";
        }else {
            spanTagForExtraMin.style.color = "green";
        }
    }
}

function calculateDateOfPreviousMonth(){
    var date = createDateOfCurrentMonthWithDay(1);
    var monthNumber = date.getMonth();
    if (monthNumber === 0){
        date.setFullYear(date.getFullYear() - 1);
        date.setMonth(11);
    }else {
        date.setMonth(monthNumber - 1);
    }
    return date;
}

function calculateDateOfNextMonth(){
    var date = createDateOfCurrentMonthWithDay(1);
    var monthNumber = date.getMonth();
    if (monthNumber === 11){
        date.setFullYear(date.getFullYear() + 1);
        date.setMonth(0);
    }else {
        date.setMonth(monthNumber + 1);
    }
    return date;
}

function createDateOfCurrentMonthWithDay(dayOfMonth){
    var captionText = $("#calendar-table caption").text();
    var year = captionText.substring(0,4);
    var month = captionText.substring(5);
    var date = new Date(month + " " + dayOfMonth + " " + year);
    return date;
}

function deleteTableBody(){
    $("#calendar-table tbody").remove();
}

function fillStatisticsTable(){
    var captionID = $("#calendar-table caption").attr("id");
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            fillWithResponse(request.responseText);
        }
    };
    request.open("GET",
        "/tlog-backend/timelogger/workmonths/" + captionID + "/statistics",
        true);
    request.send();
}

function fillWithResponse(responseText){
    var statisticsObject = JSON.parse(responseText);
    document.getElementById("working-minutes-span").innerHTML =
            statisticsObject.sumPerMonth;
    document.getElementById("required-minutes-span").innerHTML =
            statisticsObject.requiredMinPerMonth;
    var extraMinutesSpan = document.getElementById("extra-minutes-span");
    extraMinutesSpan.innerHTML =
            statisticsObject.extraMinPerMonth;
    if (statisticsObject.extraMinPerMonth < 0){
        extraMinutesSpan.parentNode.style.color = "red";
    }else {
        extraMinutesSpan.parentNode.style.color = "green";
    }
}