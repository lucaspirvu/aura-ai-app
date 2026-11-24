const form = document.getElementById('composer');
const input = document.getElementById('chatInput');
const conversation = document.getElementById('conversation');

form.addEventListener('submit', (event) => {
  event.preventEvent?.();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const userMessage = document.createElement('article');
  userMessage.className = 'message user';
  userMessage.innerHTML = '<div class="meta">Tu <time>Acum</time></div><div class="bubble"></div>';
  userMessage.querySelector('.bubble').textContent = text;
  conversation.append(userMessage);

  input.value = '';

  window.setTimeout(() => {
    const lower = text.toLowerCase();
    let reply = 'Am înregistrat cererea. Pentru acțiuni reale asupra OBS sau a altor aplicații va fi nevoie de un serviciu local conectat.';
    if (lower.includes('hello') || lower.includes('salut') || lower.includes('hey')) reply = 'Salut! Cum te pot ajuta astăzi?';
    if (lower.includes('youtube')) reply = 'YouTube este disponibil ca integrare pentru stream. În versiunea următoare îi putem afișa live evenimentele și analytics.';

    const assistant = document.createElement('article');
    assistant.className = 'message assistant';
    assistant.innerHTML = '<div class="meta"><span>✦</span>AURA <time>Acum</time></div><div class="bubble"></div>';
    assistant.querySelector('.bubble').textContent = reply;
    conversation.append(assistant);
    conversation.scrollTop = conversation.scrollHeight;
  }, 300);
});
