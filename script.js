let price = 1.87;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

const cash = document.getElementById("cash");
const changeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

purchaseBtn.addEventListener("click", () => {
    const cashValue = parseFloat(cash.value);

    if (isNaN(cashValue)) {
        alert("Please enter a valid number for cash.");
        return;
    }

    if (cashValue < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    if (cashValue === price) {
        changeDue.textContent = "No change due - customer paid with exact cash";
        return;
    }

    const result = getChange(price, cashValue, cid);

    if (result.status === "INSUFFICIENT_FUNDS") {
        changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    } else if (result.status === "CLOSED") {
        changeDue.textContent = "Status: CLOSED " + formatChange(result.change);
    } else if (result.status === "OPEN") {
        changeDue.textContent = "Status: OPEN " + formatChange(result.change);
    }
});

function getChange(price, cash, cid) {
    const changeArr = [];
    let changeDue = cash - price;
    let totalCid = cid.reduce((sum, [denom, amount]) => sum + amount, 0);
    totalCid = Math.round(totalCid * 100) / 100;

    if (changeDue > totalCid) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    const currencyUnits = [
        ["ONE HUNDRED", 100],
        ["TWENTY", 20],
        ["TEN", 10],
        ["FIVE", 5],
        ["ONE", 1],
        ["QUARTER", 0.25],
        ["DIME", 0.1],
        ["NICKEL", 0.05],
        ["PENNY", 0.01]
    ];

    for (let [unit, value] of currencyUnits) {
        let amountInDrawer = cid.find(item => item[0] === unit)[1];
        let amountToReturn = 0;

        while (changeDue >= value && amountInDrawer > 0) {
            changeDue = Math.round((changeDue - value) * 100) / 100;
            amountInDrawer = Math.round((amountInDrawer - value) * 100) / 100;
            amountToReturn = Math.round((amountToReturn + value) * 100) / 100;
        }

        if (amountToReturn > 0) {
            changeArr.push([unit, amountToReturn]);
        }
    }

    if (changeDue > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    if (totalCid === cash - price) {
        return { status: "CLOSED", change: changeArr };
    }

    return { status: "OPEN", change: changeArr };
}

function formatChange(changeArr) {
    return changeArr.map(item => `${item[0]}: $${item[1]}`).join(" ");
}
