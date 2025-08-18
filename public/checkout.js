(() => {
  const generateBtn = document.getElementById("generateBtn");
  const assetSelect = document.getElementById("assetSelect");
  const valueInput = document.getElementById("valueInput");
  const quantityInput = document.getElementById("quantityInput");

  async function startCheckout() {
    const value = parseFloat(valueInput.value);
    const quantity = parseInt(quantityInput.value) || 1;

    if (!value || value <= 0) return alert("⚠️ Valor inválido.");
    if (quantity <= 0) return alert("⚠️ Quantidade inválida.");
    if (!assetSelect.value) return alert("⚠️ Selecione um ativo.");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset: assetSelect.value, value, quantity })
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Erro ao iniciar pagamento.");

      // Redireciona para Stripe Checkout
      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  }

  generateBtn?.addEventListener("click", startCheckout);
})();
