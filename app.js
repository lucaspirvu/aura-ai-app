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
