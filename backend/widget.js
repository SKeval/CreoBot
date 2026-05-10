(function () {
  const BACKEND_URL = window.creobotConfig?.backendUrl || "https://creobot-production.up.railway.app";
  const USER_ID = window.creobotConfig?.userId || "00000000-0000-0000-0000-000000000001";

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
  `;
  document.head.appendChild(style);

  // Build UI
  document.body.innerHTML += `
    <button id="creobot-launcher">💬</button>
    <div id="creobot-window">
      <div id="creobot-header">💬 CreoBot — Ask us anything</div>
      <div id="creobot-messages">
        <div class="creobot-msg bot">Hi! How can I help you today?</div>
      </div>
      <div id="creobot-input-row">
        <input id="creobot-input" type="text" placeholder="Type a message..." />
        <button id="creobot-send">Send</button>
      </div>
    </div>
  `;

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
    messages.innerHTML += `<div class="creobot-msg bot" id="creobot-typing">Typing...</div>`;
    messages.scrollTop = messages.scrollHeight;

    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, user_id: USER_ID })
    });

    const data = await res.json();
    document.getElementById("creobot-typing").remove();

    messages.innerHTML += `<div class="creobot-msg bot">${data.reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  document.getElementById("creobot-send").onclick = sendMessage;
  document.getElementById("creobot-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });
})();