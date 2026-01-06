const sendButton = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  // user message
  const userMsg = document.createElement('div');
  userMsg.classList.add('message', 'user');
  userMsg.textContent = input;
  messagesDiv.appendChild(userMsg);

  userInput.value = '';
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  // bot typing
  const botMsg = document.createElement('div');
  botMsg.classList.add('message', 'bot');
  botMsg.textContent = 'Mengetik...';
  messagesDiv.appendChild(botMsg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();
    botMsg.textContent = data.reply;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

  } catch (err) {
    botMsg.textContent = 'Terjadi kesalahan.';
    console.error(err);
  }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});
