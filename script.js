async function connectWallet() {
    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect();
            window.userPublicKey = resp.publicKey.toString();
            alert("Wallet conectada: " + window.userPublicKey);
        } catch (err) {
            console.error("Conexión fallida", err);
        }
    } else {
        alert("Phantom no está disponible");
    }
}

async function comprarTokens(usdtAmount) {
    const solPrice = 150; // ejemplo, debe actualizarse dinámicamente
    const solAmount = (usdtAmount / solPrice).toFixed(4);
    const tokensToSend = Math.floor((usdtAmount / CONFIG.precioPorTokenUSDT) * Math.pow(10, CONFIG.tokenDecimals));

    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
    const receiver = new solanaWeb3.PublicKey(CONFIG.walletReceptora);
    const sender = new solanaWeb3.PublicKey(window.userPublicKey);

    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: receiver,
            lamports: solanaWeb3.LAMPORTS_PER_SOL * solAmount,
        })
    );

    try {
        let { signature } = await window.solana.signAndSendTransaction(transaction);
        await connection.confirmTransaction(signature);
        alert("Pago enviado. Tokens serán entregados automáticamente.");
        // Aquí va la lógica backend que detecta esta transacción y envía tokens.
    } catch (err) {
        console.error("Error al enviar el pago:", err);
    }
}