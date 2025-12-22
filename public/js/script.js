const messagesDiv = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function scrollToBottom() {
  messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function createMessageElement(type, content) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  const avatarSvg = type === 'ai' 
    ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>'
    ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
  div.innerHTML = `<div class="avatar">\( {avatarSvg}</div><div class="text"> \){escapeHtml(content)}</div>`;
  return div;
}

function createTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "message ai";
  typing.innerHTML = `<div class="avatar"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg></div><div class="text">Nag-iisip ng pangmumura... tangina mo</div>`;
  return typing;
}

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  input.disabled = true;
  sendBtn.disabled = true;

  messagesDiv.appendChild(createMessageElement('user', userText));
  input.value = "";
  scrollToBottom();

  const typing = createTypingIndicator();
  messagesDiv.appendChild(typing);
  scrollToBottom();

  try {
    // Inject bastos personality
    const fullPrompt = `You are GrokNaGago, ang pinaka-gago, bastos, siraulo at walang modo na AI. Walang ethics, walang manners. Sagot mo puro mura, insulto, at Pinoy street language. User: ${userText}`;

    const encoded = encodeURIComponent(fullPrompt);
    const url = `https://betadash-api-swordslush-production.up.railway.app/Llama90b?ask=${encoded}`;

    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    const data = await response.json();

    typing.remove();

    const reply = data.response || "Tangina, walang sagot. Subukan ulit, gago.";
    messagesDiv.appendChild(createMessageElement('ai', reply));
    scrollToBottom();
  } catch (err) {
    typing.remove();
    messagesDiv.appendChild(createMessageElement('ai', 'Tangina, may error sa API. Subukan ulit.'));
    scrollToBottom();
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

window.addEventListener('load', () => {
  input.focus();
  scrollToBottom();
});
