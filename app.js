const scrollButtons = document.querySelectorAll('[data-scroll]');

scrollButtons.forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

const voiceButton = document.getElementById('voiceButton');
const voiceDock = document.querySelector('.voice-dock');
const voiceStatus = document.getElementById('voiceStatus');
const dockText = document.getElementById('dockText');
const commandText = document.getElementById('commandText');

const commands = [
  ['“Start the welcome scene”', 'Welcome scene started'],
  ['“Mute the microphone”', 'Microphone muted'],
  ['“Create a highlight”', 'Highlight created'],
  ['“Switch to the gaming scene”', 'Scene changed']
];
let commandIndex = 0;

voiceButton.addEventListener('click', () => {
  const listening = voiceDock.classList.toggle('listening');

  if (listening) {
    voiceStatus.textContent = 'Listening';
    dockText.textContent = 'Say a command…';

    window.setTimeout(() => {
      const [command, result] = commands[commandIndex];
      commandIndex = (commandIndex + 1) % commands.length;
      voiceStatus.textContent = 'Processing';
      dockText.textContent = 'Processing command';
      commandText.textContent = command;

      window.setTimeout(() => {
        const resultElement = document.querySelector('.command-result b');
        resultElement.textContent = result;
        voiceStatus.textContent = 'Listening';
        dockText.textContent = 'Command completed';
        voiceDock.classList.remove('listening');
      }, 650);
    }, 900);
  } else {
    voiceStatus.textContent = 'Ready';
    dockText.textContent = 'Tap to start speaking';
  }
});

// This browser-only demo can open a small allowlist of websites. It cannot
// control desktop applications such as OBS without a separately installed app.
const knownSites = {
  youtube: ['youtube', 'youtube.com'],
  twitch: ['twitch', 'twitch.tv'],
  google: ['google', 'google.com'],
  discord: ['discord', 'discord.com'],
  spotify: ['spotify', 'spotify.com'],
  obs: ['obs', 'obs studio']
};

const chatWidget = document.getElementById('chatWidget');
const chatLauncher = document.getElementById('chatLauncher');
const chatClose = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

function setChatOpen(open) {
  chatWidget.classList.toggle('is-open', open);
  chatWidget.setAttribute('aria-hidden', String(!open));
  chatLauncher.setAttribute('aria-expanded', String(open));
  if (open) chatInput.focus();
}

chatLauncher.addEventListener('click', () => setChatOpen(!chatWidget.classList.contains('is-open')));
chatClose.addEventListener('click', () => setChatOpen(false));

document.querySelectorAll('[data-prompt]').forEach((button) => {
  button.addEventListener('click', () => {
    chatInput.value = button.dataset.prompt;
    chatForm.requestSubmit();
  });
});

function addMessage(text, kind) {
  const message = document.createElement('div');
  message.className = `chat-message ${kind}-message`;

  if (kind === 'aura') {
    const avatar = document.createElement('span');
    avatar.className = 'message-avatar';
    avatar.textContent = '✦';
    message.append(avatar);
  }

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;
  message.append(bubble);
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function answerCommand(rawText) {
  const text = rawText.toLocaleLowerCase('ro-RO').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const openMatch = text.match(/(?:deschide|open)\s+([a-z0-9 .-]+)/i);

  if (openMatch) {
    const requested = openMatch[1].trim().replace(/[.!?]+$/, '').toLowerCase();
    const siteKey = Object.keys(knownSites).find((key) => knownSites[key].includes(requested));
    if (!siteKey) return 'Momentan pot deschide doar YouTube, Twitch, Google, Discord și Spotify. Pentru siguranță nu deschid adrese arbitrare.';
    if (siteKey === 'obs') return 'OBS este o aplicație de calculator. Un site web nu o poate porni direct; pentru asta va trebui să conectăm o aplicație desktop AURA.';

    const domains = { youtube: 'https://www.youtube.com', twitch: 'https://www.twitch.tv', google: 'https://www.google.com', discord: 'https://discord.com', spotify: 'https://open.spotify.com' };
    window.open(domains[siteKey], '_blank', 'noopener,noreferrer');
    return `Am deschis ${siteKey[0].toUpperCase() + siteKey.slice(1)} într-o filă nouă.`;
  }

  if (/obs|scena|scene|microfon|mute|highlight|gaming/i.test(text)) {
    const command = rawText;
    commandText.textContent = `“${command}”`;
    const result = /mute|microfon/i.test(text) ? 'Microfon — demo' : /highlight/i.test(text) ? 'Highlight — demo' : 'Comandă — demo';
    document.querySelector('.command-result b').textContent = result;
    return 'Am înregistrat comanda în demo. Acțiunea reală în OBS sau asupra microfonului necesită o aplicație desktop conectată; pagina web nu poate controla programele de pe calculator.';
  }

  return 'Pot ajuta cu comenzi demonstrative pentru scene, microfon și highlights, sau pot deschide YouTube, Twitch, Google, Discord și Spotify. Încearcă: „deschide YouTube”.';
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';
  window.setTimeout(() => addMessage(answerCommand(text), 'aura'), 250);
});
