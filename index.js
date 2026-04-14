const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

// TERI WORKING KEY
const GROQ_API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

client.on('qr', (qr) => {
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
    console.log('👇 QR SCAN KARO 👇\n' + qrLink);
});

client.on('ready', () => console.log('✅ Tera AI Clone Online Hai!'));

client.on('message', async msg => {
    if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) return;

    const chat = await msg.getChat();
    await chat.sendSeen();
    await chat.sendStateTyping(); 
    await delay(3000); // 3 sec delay taaki lage tu type kar raha hai

    try {
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
                        content: "Tu Dipesh hai, Harsh Vihar ka rehne wala 10th class ka student aur developer. Doston se ekdam casual Hinglish me baat kar (e.g. 'haan bhai', 'kya hua', 'mast'). Replies ekdam chote rakhna (1 line). Kabhi mat bolna ki tu AI hai."
                    },
                    { role: "user", content: msg.body }
                ]
            })
        });

        const data = await response.json();
        await chat.clearState();
        if (data.choices) msg.reply(data.choices[0].message.content);
    } catch (e) { console.log("Error!"); }
});

client.initialize();
