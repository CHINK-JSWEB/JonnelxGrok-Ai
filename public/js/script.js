async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  // Add user message (same code mo)
  messagesDiv.appendChild(createMessageElement('user', userText));
  input.value = "";
  scrollToBottom();

  // Typing indicator
  const typingIndicator = createTypingIndicator();
  messagesDiv.appendChild(typingIndicator);
  scrollToBottom();

  try {
    const encodedAsk = encodeURIComponent(userText);
    const url = `https://betadash-api-swordslush-production.up.railway.app/Llama90b?ask=${encodedAsk}`;

    const response = await fetch(url);
    const data = await response.json();

    typingIndicator.remove();

    const aiReply = data.response || "Tangina, walang sagot. Subukan ulit, gago.";
    messagesDiv.appendChild(createMessageElement('ai', aiReply));
    scrollToBottom();

  } catch (err) {
    typingIndicator.remove();
    messagesDiv.appendChild(createMessageElement('ai', 'Tangina, may error sa free API. Subukan ulit.'));
    scrollToBottom();
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}