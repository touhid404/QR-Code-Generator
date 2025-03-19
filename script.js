document.addEventListener("DOMContentLoaded", function () {
    loadSavedQRs();
});

function generateQR(savedQR = null) {
    let link = savedQR ? savedQR.link : document.getElementById("linkInput").value.trim();
    if (link === "") {
        alert("Please enter a valid URL");
        return;
    }

    document.getElementById("qrcode").innerHTML = "";
    let qr = new QRCode(document.getElementById("qrcode"), {
        text: link,
        width: 200,
        height: 200
    });

    setTimeout(() => {
        let img = document.querySelector("#qrcode img");
        if (img) {
            img.setAttribute("id", "qrImage");
            document.getElementById("downloadBtn").classList.remove("hidden");
            if (!savedQR) saveQRCode(link, img.src);
        }
    }, 100);
}

function downloadQR() {
    let qrImage = document.getElementById("qrImage");
    if (!qrImage) {
        alert("Generate a QR code first!");
        return;
    }
    let link = document.createElement("a");
    link.href = qrImage.src;
    link.download = "qrcode.png";
    link.click();
}

function saveQRCode(link, qrSrc) {
    let qrList = JSON.parse(localStorage.getItem("qrList")) || [];
    qrList.push({ link, qrSrc });
    localStorage.setItem("qrList", JSON.stringify(qrList));
    loadSavedQRs();
}

function loadSavedQRs() {
    let qrList = JSON.parse(localStorage.getItem("qrList")) || [];
    let qrListContainer = document.getElementById("qrList");
    qrListContainer.innerHTML = "";
    

    qrList.forEach((qr, index) => {
        let qrItem = document.createElement("div");
        qrItem.classList.add("qr-item");

        let qrImage = document.createElement("img");
        qrImage.src = qr.qrSrc;

        let qrLink = document.createElement("a");
        qrLink.href = qr.link;
        qrLink.target = "_blank";
        qrLink.textContent = qr.link;

        qrItem.onclick = () => generateQR(qr);

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = (event) => {
            event.stopPropagation();
            deleteQR(index);
        };

        qrItem.appendChild(qrImage);
        qrItem.appendChild(qrLink);
        qrItem.appendChild(deleteBtn);

        qrListContainer.appendChild(qrItem);
    });
}

function deleteQR(index) {
    let qrList = JSON.parse(localStorage.getItem("qrList")) || [];
    qrList.splice(index, 1);
    localStorage.setItem("qrList", JSON.stringify(qrList));
    loadSavedQRs();
}