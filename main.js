// --- App Opening Logic ---
window.openWindows = {};
let zIndexCounter = 100;
function launchApp(app) {
  if (app === 'filemanager') openWindow('File Manager', window.FileManagerApp, '📁');
  if (app === 'videoplayer') openWindow('Video Player', window.VideoPlayerApp, '🎬');
  if (app === 'webbrowser') openWindow('Web Browser', window.WebBrowserApp, '🌐');
  if (app === 'settings') openWindow('Settings', window.SettingsApp, '⚙️');
  if (app === 'terminal') openWindow('Terminal', window.TerminalApp, '🖳');
  if (app === 'taskmanager') openWindow('Task Manager', window.TaskManagerApp, '📊');
  if (app === 'download') openWindow('Download', window.DownloadApp, '⬇️');
}
function openWindow(title, appFunc, icon) {
  const winId = 'window-' + title.replace(/\s+/g, '').toLowerCase();
  if (window.openWindows[winId]) {
    const existing = window.openWindows[winId];
    existing.style.display = '';
    existing.style.zIndex = zIndexCounter++;
    existing.classList.add('focus');
    setTimeout(() => existing.classList.remove('focus'), 450);
    return;
  }
  const win = document.createElement('div');
  win.className = 'window';
  win.id = winId;
  win.style.top = '0';
  win.style.left = '0';
  win.style.width = '100vw';
  win.style.height = 'calc(100vh - 48px)';
  win.style.zIndex = zIndexCounter++;
  const header = document.createElement('div');
  header.className = 'window-header';
  header.innerHTML = `<span class="window-title">${icon ? icon : ''} ${title}</span>`;
  const controls = document.createElement('span');
  controls.className = 'window-controls';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'wctrl';
  closeBtn.title = "Close";
  closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><line x1="4" y1="4" x2="12" y2="12" stroke="#fff" stroke-width="2"/><line x1="12" y1="4" x2="4" y2="12" stroke="#fff" stroke-width="2"/></svg>';
  controls.appendChild(closeBtn);
  header.appendChild(controls);
  win.appendChild(header);
  const content = document.createElement('div');
  content.className = 'window-content';
  appFunc(content);
  win.appendChild(content);
  document.body.appendChild(win);
  window.openWindows[winId] = win;
  // Taskbar
  const taskbar = document.getElementById('taskbar-apps');
  const btn = document.createElement('button');
  btn.className = 'taskbar-btn';
  btn.innerHTML = `${icon ? icon : ''}<span>${title}</span>`;
  btn.onclick = () => {
    win.style.zIndex = zIndexCounter++;
    win.style.display = '';
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 150);
    win.classList.add('focus');
    setTimeout(() => win.classList.remove('focus'), 450);
  };
  taskbar.appendChild(btn);
  closeBtn.onclick = () => {
    win.classList.add('closing');
    setTimeout(() => {
      win.remove();
      btn.remove();
      delete window.openWindows[winId];
    }, 350);
  };
}
window.closeWindowById = function(winId) {
  const win = window.openWindows[winId];
  if (win) {
    win.classList.add('closing');
    setTimeout(() => {
      win.remove();
      const btns = [...document.querySelectorAll('#taskbar-apps .taskbar-btn')];
      btns.forEach(btn => {
        if (btn.innerText.trim().toLowerCase().startsWith(winId.replace(/^window-/, ''))) btn.remove();
      });
      delete window.openWindows[winId];
    }, 350);
  }
}

// --- Clock and Network ---
function updateClock() {
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('clock').textContent = `${dateStr} ${timeStr}`;
}
setInterval(updateClock, 1000); updateClock();
function updateNetwork() {
  const status = navigator.onLine ? "Online" : "Offline";
  const netSpan = document.getElementById('network-status');
  netSpan.textContent = status;
  netSpan.className = status === "Online" ? "" : "offline";
}
window.addEventListener('online', updateNetwork); window.addEventListener('offline', updateNetwork);
setTimeout(updateNetwork, 10);

// --- Desktop bg helpers ---
function setDesktopBgImage(imgUrl) {
  document.getElementById('desktop-bg').style.background = `url('${imgUrl}') no-repeat center center/cover`;
  localStorage.setItem('astra_desktop_bg_image', imgUrl);
  localStorage.setItem('astra_desktop_bg_color', '');
}
function setDesktopBgColor(color) {
  document.getElementById('desktop-bg').style.background = color;
  localStorage.setItem('astra_desktop_bg_color', color);
  localStorage.setItem('astra_desktop_bg_image', '');
}
// On load
(function() {
  let img = localStorage.getItem('astra_desktop_bg_image');
  let color = localStorage.getItem('astra_desktop_bg_color');
  if (img) setDesktopBgImage(img);
  else if (color) setDesktopBgColor(color);
})();