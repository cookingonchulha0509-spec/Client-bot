const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

// Human-touch ke liye custom delay engine
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    // Professional HD QR Link Generator
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
    console.log('👇 HD QR Code Link (Browser mein open karein) 👇');
    console.log(qrLink);
});

client.on('ready', () => {
    console.log('✅ Innovation Hub AI Agent is Online and Ready!');
});

client.on('message', async msg => {
    // Faltu spam aur Groups ko ignore karna
    if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) return;

    try {
        console.log(`\n📩 Naya Client Message: ${msg.body}`);
        
        const chat = await msg.getChat();

        // STEP 1: Message ko "Read" (Blue Tick) mark karo
        await chat.sendSeen();
        
        // STEP 2: Client ko "typing..." dikhao
        await chat.sendStateTyping(); 
        
        // STEP 3: Natural Delay (AI 2.5 seconds sochega)
        await delay(2500); 

        // STEP 4: Groq API Call (Versatile fast model)
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.1-70b-versatile', 
            messages: [
                {
                    role: 'system',
                    content: `You are a highly professional, polite, and sophisticated AI assistant representing 'Innovation Hub'. You must communicate fluently in a seamless mix of formal Hindi and English. Your tone should be extremely respectful, corporate, and helpful. Avoid casual slang or overly robotic language. Keep your responses well-structured.`
                },
                {
                    role: 'user',
                    content: msg.body
                }
            ]
        }, {
            headers: {
                // APNI API KEY YAHAN DAALNA (Bina koi extra space ke)
                'Authorization': `Bearer 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`, 
                'Content-Type': 'application/json'
            }
        });

        const aiReply = response.data.choices[0].message.content;

        // STEP 5: Typing OFF aur Final Reply bhejna
        await chat.clearState();
        msg.reply(aiReply);
        console.log('🚀 AI Reply successfully bhej diya gaya!');

    } catch (error) {
        // ERROR CATCHER: Agar API fail hui toh crash nahi hoga
        console.error('\n❌ Groq API Error:', error.response ? error.response.data : error.message);
        
        try {
            const chat = await msg.getChat();
            await chat.clearState(); // Typing band karo
            msg.reply('Maaf kijiye, humara server abhi thoda vyast hai. Kripaya kuch samay baad punah prayaas karein. Thank you for choosing Innovation Hub.');
        } catch(e) {
            console.log('Error send karne mein fail hua:', e.message);
        }
    }
});

client.initialize();
