// =================================================================
const realGoogleFormID =
  "1FAIpQLSf_uo7kvr-S1t45_jLGcOr7ST5SQWURnXwbfWvlp-QQQe5hbQ";
const entryFullname = "2013590127"; // entry nama lengkap
const entryShift = "116997613"; // entry shift
const entryAnalisa = "1151382872"; // entry analisa
const entryEvidence = "893076951"; // entry evidence
// =================================================================

let setName = "";
let setShift = "";
let splitData = [];

function checkIsMerge(dataTicket) {
  let result = "";
  if (dataTicket.includes("-")) {
    result += "+(M)";
  }
  return result;
}

function generateAnalisa(dataTicket) {
  const res = checkIsMerge(dataTicket);
  const baseRes = isIDCustomer(dataTicket.replace(/-/g, ""))
    ? "GROUP+WAG"
    : "TICKET";
  return `entry.${entryAnalisa}=${baseRes}${res}`;
}

function generateListPreview(val) {
  const tableBodyTiketNM = document.querySelector("#table-container-1 tbody");
  const tableBodyTiketM = document.querySelector("#table-container-2 tbody");
  const tableBodyCustNM = document.querySelector("#table-container-3 tbody");
  const tableBodyCustM = document.querySelector("#table-container-4 tbody");
  let ctrTiket = 0;
  let ctrCust = 0;

  tableBodyTiketNM.innerHTML = "";
  tableBodyTiketM.innerHTML = "";
  tableBodyCustNM.innerHTML = "";
  tableBodyCustM.innerHTML = "";
  val.forEach((element) => {
    const spliter = checkIsMerge(element);
    if (isIDCustomer(element.replace(/-/g, ""))) {
      ctrCust++;
      const row =
        spliter === ""
          ? tableBodyTiketNM.insertRow()
          : tableBodyTiketM.insertRow();
      const cell = row.insertCell();
      cell.textContent = element.replace(/-/g, "");
      row.className =
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted";
      cell.className = "p-4 align-middle [&amp;:has([role=checkbox])]:pr-0";
    } else {
      ctrTiket++;
      const row =
        spliter === ""
          ? tableBodyCustNM.insertRow()
          : tableBodyCustM.insertRow();
      const cell = row.insertCell();
      cell.textContent = element.replace(/-/g, "");
      row.className =
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted";
      cell.className = "p-4 align-middle [&amp;:has([role=checkbox])]:pr-0";
    }
  });
  document.querySelector("#ctr-tiket").textContent = `(${ctrTiket})`;
  document.querySelector("#ctr-cust").textContent = `(${ctrCust})`;
}

function readFile() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const text = event.target.result;
    setName = file.name.replace(".txt", "").split("-")[0];
    setShift = file.name.replace(".txt", "").split("-")[1];
    splitData = text
      .replace(/\n/g, "")
      .replace(/\r/g, "")
      .split(",")
      .filter((value) => value.trim() !== "");
    generateListPreview(splitData);
    document.querySelector("button").disabled = false;
  };
  reader.readAsText(file);
}

function isIDCustomer(str) {
  const regex = /^[0-9]+$/;
  return regex.test(str);
}

function sendData() {
  document.querySelector("button").disabled = true;
  let percentage = 0;
  const incremental = 100 / splitData.length;
  const fullName = `entry.${entryFullname}=${setName
    .toUpperCase()
    .replace(/ /g, "+")}`;
  const timeShift = `entry.${entryShift}=${setShift.toUpperCase()}`;
  const promises = splitData.map((data) => {
    const analisa = generateAnalisa(data);
    const evidence = `entry.${entryEvidence}=${data.replace(/-/g, "")}`;
    console.log(
      `https://docs.google.com/forms/d/e/${realGoogleFormID}/formResponse?usp=pp_url&${fullName}&${timeShift}&${analisa}&${evidence}`
    );
    return fetch(
      `https://docs.google.com/forms/d/e/${realGoogleFormID}/formResponse?usp=pp_url&${fullName}&${timeShift}&${analisa}&${evidence}`,
      { mode: "no-cors" }
    )
      .then((response) => {
        percentage += incremental;
        document.querySelector("button").textContent = `${percentage}%`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  Promise.all(promises)
    .then(() => {
      console.log("All promises done");
      document.querySelector("button").textContent = "Done !";
      setTimeout(() => {
        reset();
      }, 500);
    })
    .catch((error) => {
      console.error("One or more promises failed:", error);
      alert("Terjadi Kesalahan");
    });
}

function reset() {
  document.querySelector("button").textContent = "Submit";
  document.getElementById("file-input").value = "";
  document.querySelector("#table-container-1 tbody").innerHTML = "";
  document.querySelector("#table-container-2 tbody").innerHTML = "";
  document.querySelector("#table-container-3 tbody").innerHTML = "";
  document.querySelector("#table-container-4 tbody").innerHTML = "";
  document.querySelector("#ctr-tiket").textContent = "";
  document.querySelector("#ctr-cust").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("theme-icon");
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    htmlElement.classList.add("dark-mode");
    img.src = "assets/dark.svg";
  } else {
    htmlElement.classList.remove("dark-mode");
    img.src = "assets/light.svg";
  }
});

function toggleTheme() {
  const img = document.getElementById("theme-icon");
  const htmlElement = document.documentElement;

  const isDark = htmlElement.classList.toggle("dark-mode");
  const newTheme = isDark ? "dark" : "light";

  img.src = isDark ? "assets/dark.svg" : "assets/light.svg";
  localStorage.setItem("theme", newTheme);
}
