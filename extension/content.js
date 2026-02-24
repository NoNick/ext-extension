const script = document.createElement('script');
script.textContent = `
  (function() {
    const originalPrompt = window.prompt;
    window.prompt = function(message, defaultValue) {
      console.log('Intercepted:', defaultValue);
      const div = document.createElement('div');
      div.className = 'magnet-result-ext-extension';
      div.style.display = 'none';
      div.textContent = defaultValue;
      document.body.appendChild(div);
    };
  })();
`;
(document.documentElement || document.head).appendChild(script);
script.remove();
