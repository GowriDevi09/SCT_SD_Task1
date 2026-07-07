const temp = document.getElementById("temperature");
const from = document.getElementById("fromUnit");
const to = document.getElementById("toUnit");
const result = document.getElementById("result");

const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const historyList = document.getElementById("historyList");
const deleteHistory = document.getElementById("deleteHistory");
const downloadCSV = document.getElementById("downloadCSV");

const themeBtn = document.getElementById("themeBtn");

const toast = document.getElementById("toast");
const loader = document.getElementById("loader");

let history = JSON.parse(localStorage.getItem("history")) || [];

displayHistory();

/* ---------------- Loader ---------------- */

function showLoader() {
    loader.style.display = "flex";
    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
}

/* ---------------- Toast ---------------- */

function showToast(message) {

    toast.innerHTML = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);

}

/* ---------------- Conversion ---------------- */

function convertTemperature() {

    let value = parseFloat(temp.value);

    if (isNaN(value)) {
        result.innerHTML = "Enter Temperature";
        return;
    }

    /* Absolute Zero Validation */

    if (from.value === "C" && value < -273.15) {
        result.innerHTML = "❌ Below Absolute Zero";
        return;
    }

    if (from.value === "F" && value < -459.67) {
        result.innerHTML = "❌ Below Absolute Zero";
        return;
    }

    if (from.value === "K" && value < 0) {
        result.innerHTML = "❌ Kelvin can't be negative";
        return;
    }

    let c;

    if (from.value === "C") {
        c = value;
    }

    if (from.value === "F") {
        c = (value - 32) * 5 / 9;
    }

    if (from.value === "K") {
        c = value - 273.15;
    }

    let ans;

    if (to.value === "C")
        ans = c;

    if (to.value === "F")
        ans = c * 9 / 5 + 32;

    if (to.value === "K")
        ans = c + 273.15;

    result.innerHTML =
        `${value} °${from.value} = <br><b>${ans.toFixed(2)} °${to.value}</b>`;

    addHistory(
        `${value} °${from.value} ➜ ${ans.toFixed(2)} °${to.value}`
    );

}

/* ---------------- History ---------------- */

function addHistory(text) {

    history.unshift(text);

    if (history.length > 10)
        history.pop();

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    displayHistory();

}

function displayHistory() {

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
            "<li>No conversions yet.</li>";

        return;
    }

    history.forEach(item => {

        let li = document.createElement("li");

        li.innerHTML = item;

        historyList.appendChild(li);

    });

}

/* ---------------- Clear History ---------------- */

deleteHistory.onclick = () => {

    history = [];

    localStorage.removeItem("history");

    displayHistory();

    showToast("History Cleared");

};

/* ---------------- Download CSV ---------------- */

downloadCSV.onclick = () => {

    if (history.length === 0) {
        showToast("No History");
        return;
    }

    let csv = "Conversion History\n";

    history.forEach(item => {
        csv += item + "\n";
    });

    let blob = new Blob([csv], {
        type: "text/csv"
    });

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.href = url;

    a.download = "History.csv";

    a.click();

};

/* ---------------- Swap ---------------- */

swapBtn.onclick = () => {

    let x = from.value;

    from.value = to.value;

    to.value = x;

    convertTemperature();

};

/* ---------------- Copy ---------------- */

copyBtn.onclick = () => {

    navigator.clipboard.writeText(
        result.innerText
    );

    showToast("Copied");

};

/* ---------------- Reset ---------------- */

clearBtn.onclick = () => {

    temp.value = "";

    from.selectedIndex = 0;

    to.selectedIndex = 0;

    result.innerHTML = "--";

};

/* ---------------- Auto Convert ---------------- */

temp.addEventListener("input", () => {

    if (temp.value !== "")
        convertTemperature();

});

from.addEventListener("change", convertTemperature);

to.addEventListener("change", convertTemperature);

convertBtn.onclick = () => {

    showLoader();

    setTimeout(() => {

        convertTemperature();

    }, 450);

};

/* ---------------- Dark Mode ---------------- */

themeBtn.onclick = () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.innerHTML =
            '<i class="fas fa-sun"></i>';

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        themeBtn.innerHTML =
            '<i class="fas fa-moon"></i>';

        localStorage.setItem(
            "theme",
            "light"
        );

    }

};

window.onload = () => {

    let theme =
        localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeBtn.innerHTML =
            '<i class="fas fa-sun"></i>';

    }

};

/* ---------------- Keyboard Shortcut ---------------- */

document.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        convertTemperature();

    }

});