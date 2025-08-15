(() => {
  const generateBtn = document.getElementById("generateBtn");
  const qrContainer = document.getElementById("qrcode-pix");
  const output = document.getElementById("output");
  const assetSelect = document.getElementById("assetSelect");
  const valueInput = document.getElementById("valueInput");
  const quantityInput = document.getElementById("quantityInput");

  async function generateQR() {
    qrContainer.innerHTML = "";
    output.innerText = "";

    const value = parseFloat(valueInput.value);
    const quantity = parseInt(quantityInput.value) || 1;

    if (!value || value <= 0) return alert("⚠️ Valor inválido.");
    if (quantity <= 0) return alert("⚠️ Quantidade inválida.");
    if (!assetSelect.value) return alert("⚠️ Selecione um ativo.");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, quantity })
      });

      const data = await response.json();
      if (!response.ok) return alert(data.error || "Erro ao gerar QR Code.");

      const { pixPayload, streamKey } = data;

      new QRCode(qrContainer, {
        text: pixPayload,
        width: 180,
        height: 180,
        colorDark: "#ff7f00",
        colorLight: "#1c1c1c",
        correctLevel: QRCode.CorrectLevel.H
      });

      localStorage.setItem("streamKey", streamKey);
      output.innerText = `📲 QR Code Z-OBTC gerado\nValor total: R$${(value*quantity).toFixed(2)}\n🔁 Stream Key: ${streamKey}`;

    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  }

  generateBtn?.addEventListener("click", generateQR);
})();
