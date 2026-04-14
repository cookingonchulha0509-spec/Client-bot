const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

// TERI EXACT WAHI KEY AUR MODEL JO HTML MEIN CHAL RAHE HAIN
const GROQ_API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";

client.on('qr', (qr) => {
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
    console.log('👇 HD QR Code Link 👇');
    console.log(qrLink);
});

client.on('ready', () => {
    console.log('✅ Innovation Hub AI Agent is Online!');
});

client.on('message', async msg => {
    // Faltu groups aur status ko ignore karo
    if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) return;

    console.log(`\n📩 Naya Message Aaya: ${msg.body}`);
    const chat = await msg.getChat();

    // Blue tick aur typing...
    await chat.sendSeen();
    await chat.sendStateTyping(); 

    try {
        // EXACT HTML WALA FETCH LOGIC 
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    {
                        role: "system",
                        content: "You are a highly professional, polite, and sophisticated AI assistant representing 'Innovation Hub'. Respond formally in a mix of Hindi and English."
                    },
                    { role: "user", content: msg.body }
                ]
            })
        });

        const data = await response.json();
        await chat.clearState(); // Typing band karo

        if (data.error) {
            console.error("❌ Groq Error:", data.error);
            // Ab agar error aayega toh wo error seedha tere WhatsApp pe bhej dega taaki pata chale reason kya hai!
            msg.reply(`Bot System Error: ${data.error.message}`);
        } else {
            const aiReply = data.choices[0].message.content;
            msg.reply(aiReply);
            console.log('🚀 AI Reply Bhej Diya!');
        }

    } catch (error) {
        console.error("❌ Fetch Error:", error);
        await chat.clearState();
        msg.reply("Maaf kijiye, server connection mein error hai.");
    }
});

client.initialize();

