(function () {
  const BACKEND_URL = window.creobotConfig?.backendUrl || "https://creobot-production.up.railway.app";
  const USER_ID = window.creobotConfig?.userId || "00000000-0000-0000-0000-000000000001";

  // --- Multi-language strings ---
  const WIDGET_STRINGS = {
    en: {
      placeholder: "Type a message...",
      poweredBy: "Powered by CreoBot",
      thinking: "Thinking...",
      error: "Something went wrong. Please try again.",
      handoff: "A human will follow up with you shortly via email.",
      langLabel: "Language",
      greeting: "Hi! How can I help you today?",
      send: "Send"
    },
    es: {
      placeholder: "Escribe un mensaje...",
      poweredBy: "Desarrollado por CreoBot",
      thinking: "Pensando...",
      error: "Algo salio mal. Por favor, intentalo de nuevo.",
      handoff: "Un humano te contactara pronto por correo electronico.",
      langLabel: "Idioma",
      greeting: "Hola! Como puedo ayudarte hoy?",
      send: "Enviar"
    },
    pt: {
      placeholder: "Digite uma mensagem...",
      poweredBy: "Desenvolvido por CreoBot",
      thinking: "Pensando...",
      error: "Algo deu errado. Por favor, tente novamente.",
      handoff: "Um humano entrara em contato em breve por e-mail.",
      langLabel: "Idioma",
      greeting: "Ola! Como posso ajudar voce hoje?",
      send: "Enviar"
    },
    fr: {
      placeholder: "Tapez un message...",
      poweredBy: "Propulse par CreoBot",
      thinking: "Reflexion en cours...",
      error: "Une erreur est survenue. Veuillez reessayer.",
      handoff: "Un humain vous contactera bientot par e-mail.",
      langLabel: "Langue",
      greeting: "Bonjour! Comment puis-je vous aider?",
      send: "Envoyer"
    },
    de: {
      placeholder: "Nachricht eingeben...",
      poweredBy: "Angetrieben von CreoBot",
      thinking: "Denke nach...",
      error: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
      handoff: "Ein Mitarbeiter meldet sich bald per E-Mail bei Ihnen.",
      langLabel: "Sprache",
      greeting: "Hallo! Wie kann ich Ihnen helfen?",
      send: "Senden"
    }
  };

  function detectLanguage(userId) {
    const stored = localStorage.getItem('creobot_lang_' + userId);
    if (stored && WIDGET_STRINGS[stored]) return stored;
    const b = (navigator.language || 'en').toLowerCase();
    if (b.startsWith('es')) return 'es';
    if (b.startsWith('pt')) return 'pt';
    if (b.startsWith('fr')) return 'fr';
    if (b.startsWith('de')) return 'de';
    return 'en';
  }

  let currentLang = detectLanguage(USER_ID);

  // Inject styles
  const style = document.createElement("style");
  style.innerHTML = `
    #creobot-launcher {
      position: fixed; bottom: 24px; right: 24px;
      width: 56px; height: 56px; border-radius: 50%;
      background: #1a56db; color: white; font-size: 26px;
      border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999; display: flex; align-items: center; justify-content: center;
    }
    creobot-lang-option {
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      color: #1e293b;
      background: white;
    }
    .creobot-lang-option:hover {
      background: #1a56db;
      color: white;
    }
    #creobot-window {
      position: fixed; bottom: 90px; right: 24px;
      width: 360px; height: 500px; background: white;
      border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: none; flex-direction: column; z-index: 9998;
      font-family: sans-serif; overflow: hidden;
    }
    #creobot-header {
      background: #1a56db; color: white; padding: 14px 16px;
      font-weight: 600; font-size: 15px;
      display: flex; align-items: center; justify-content: space-between;
    }
    #creobot-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .creobot-msg {
      max-width: 80%; padding: 10px 14px;
      border-radius: 12px; font-size: 14px; line-height: 1.5;
    }
    .creobot-msg.bot {
      background: #f1f5f9; color: #1e293b; align-self: flex-start;
    }
    .creobot-msg.user {
      background: #1a56db; color: white; align-self: flex-end;
    }
    #creobot-input-row {
      display: flex; padding: 12px; border-top: 1px solid #e2e8f0; gap: 8px;
    }
    #creobot-input {
      flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0;
      border-radius: 8px; font-size: 14px; outline: none;
    }
    #creobot-send {
      background: #1a56db; color: white; border: none;
      border-radius: 8px; padding: 8px 14px; cursor: pointer; font-size: 14px;
    }
    #creobot-powered-by {
      text-align: center; padding: 4px 0 8px;
      font-size: 11px; color: #94a3b8;
    }
  `;
  document.head.appendChild(style);

  // Build UI
  document.body.innerHTML += `
    <button id="creobot-launcher">💬</button>
    <div id="creobot-window">
      <div id="creobot-header">
        <span>💬 CreoBot - Ask us anything</span>
        <div id="creobot-lang-wrapper" style="position:relative;">
          <button id="creobot-lang-btn" style="
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            padding: 2px 8px;
            font-family: sans-serif;
          ">EN</button>
          <div id="creobot-lang-menu" style="
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            min-width: 60px;
            overflow: hidden;
          ">
            <div class="creobot-lang-option" data-lang="en">EN</div>
            <div class="creobot-lang-option" data-lang="es">ES</div>
            <div class="creobot-lang-option" data-lang="pt">PT</div>
            <div class="creobot-lang-option" data-lang="fr">FR</div>
            <div class="creobot-lang-option" data-lang="de">DE</div>  
          </div>
        </div>
      </div>
      <div id="creobot-messages">
            <div class="creobot-msg bot">${WIDGET_STRINGS[currentLang].greeting}</div>
      </div>
      <div id="creobot-input-row">
        <input id="creobot-input" type="text" placeholder="${WIDGET_STRINGS[currentLang].placeholder}" />
        <button id="creobot-send">${WIDGET_STRINGS[currentLang].send}</button>
      </div>
      <div id="creobot-powered-by">${WIDGET_STRINGS[currentLang].poweredBy}</div>
    </div>
  `;

  // Set initial button text
  document.getElementById("creobot-lang-btn").textContent = currentLang.toUpperCase();

  // Toggle menu on button click
  document.getElementById("creobot-lang-btn").onclick = function(e) {
    e.stopPropagation();
    const menu = document.getElementById("creobot-lang-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };

  // Handle option click
  document.querySelectorAll(".creobot-lang-option").forEach(function(opt) {
    opt.onclick = function() {
      currentLang = this.getAttribute("data-lang");
      localStorage.setItem("creobot_lang_" + USER_ID, currentLang);
      document.getElementById("creobot-lang-btn").textContent = currentLang.toUpperCase();
      document.getElementById("creobot-lang-menu").style.display = "none";
      document.getElementById("creobot-input").placeholder = WIDGET_STRINGS[currentLang].placeholder;
      document.getElementById("creobot-powered-by").textContent = WIDGET_STRINGS[currentLang].poweredBy;
      document.getElementById("creobot-send").textContent = WIDGET_STRINGS[currentLang].send;
      document.getElementById("creobot-messages").innerHTML =
        "<div class='creobot-msg bot'>" + WIDGET_STRINGS[currentLang].greeting + "</div>";
    };
  });

  // Close menu when clicking outside
  document.addEventListener("click", function() {
    const menu = document.getElementById("creobot-lang-menu");
    if (menu) menu.style.display = "none";
  });

  // Toggle open/close
  document.getElementById("creobot-launcher").onclick = function () {
    const win = document.getElementById("creobot-window");
    win.style.display = win.style.display === "flex" ? "none" : "flex";
  };

  // Send message
  async function sendMessage() {
    const input = document.getElementById("creobot-input");
    const messages = document.getElementById("creobot-messages");
    const text = input.value.trim();
    if (!text) return;

    input.value = "";

    // User bubble
    messages.innerHTML += `<div class="creobot-msg user">${text}</div>`;
    messages.scrollTop = messages.scrollHeight;

    // Typing indicator
    messages.innerHTML += `<div class="creobot-msg bot" id="creobot-typing">${WIDGET_STRINGS[currentLang].thinking}</div>`;
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, user_id: USER_ID, language: currentLang })
      });

      const data = await res.json();
      document.getElementById("creobot-typing").remove();

      const formatted = data.reply
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul style="margin:6px 0;padding-left:18px;">$1</ul>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

      messages.innerHTML += `<div class="creobot-msg bot">${formatted}</div>`;

      if (data.handoff) {
        messages.innerHTML += `<div class="creobot-msg bot">${WIDGET_STRINGS[currentLang].handoff}</div>`;
      }

      messages.scrollTop = messages.scrollHeight;
    } catch (err) {
      const typing = document.getElementById("creobot-typing");
      if (typing) typing.remove();
      messages.innerHTML += `<div class="creobot-msg bot">${WIDGET_STRINGS[currentLang].error}</div>`;
      messages.scrollTop = messages.scrollHeight;
    }
  }

  document.getElementById("creobot-send").onclick = sendMessage;
  document.getElementById("creobot-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });
})();
