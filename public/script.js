(() => {
  const generateBtn = document.getElementById("generateBtn");

  function clearQRCode() {
    document.getElementById("qrcode-pix").innerHTML = "";
    document.getElementById("output").innerText = "";
  }

  async function generateQR() {
    clearQRCode();

    const value = parseFloat(document.getElementById("valueInput").value);
    const quantity = parseInt(document.getElementById("quantityInput").value) || 1;

    if (!value || value <= 0) return alert("⚠️ Valor inválido.");
    if (quantity <= 0) return alert("⚠️ Quantidade inválida.");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, quantity })
      });

      const data = await res.json();

      if (res.ok) {
        new QRCode(document.getElementById("qrcode-pix"), {
          text: data.pixPayload,
          width: 180,
          height: 180,
          colorDark: "#ff7f00",
          colorLight: "#1c1c1c",
          correctLevel: QRCode.CorrectLevel.H
        });

        localStorage.setItem("streamKey", data.streamKey);

        document.getElementById("output").innerText =
          `📲 QR Code Z-OBTC gerado\nValor total: R$${data.totalValue.toFixed(2)}\n🔁 Stream Key: ${data.streamKey}`;
      } else {
        alert(data.error || "Erro ao gerar QR Code.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  }

  generateBtn?.addEventListener("click", generateQR);
})();
