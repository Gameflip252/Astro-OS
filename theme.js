function setTheme(theme) {
  // Only desktop UI, not background
  const dark = {
    '--bg': '#171c29',
    '--desk-bg': 'linear-gradient(135deg, #232943 0%, #292c3b 100%)',
    '--icon-bg': 'rgba(34,34,44,0.77)',
    '--icon-text': '#fff',
    '--taskbar-bg': '#181b29e6',
    '--taskbar-border': '#252840',
    '--taskbar-btn-bg': 'linear-gradient(135deg, #232849 0%, #242942 100%)',
    '--taskbar-btn-bg-hover': 'linear-gradient(135deg, #38407a 0%, #232849 100%)',
    '--window-bg': '#20243b',
    '--window-border': '#252840',
    '--window-header-bg': 'linear-gradient(90deg, #2b314a 0%, #20243b 100%)',
    '--window-content-bg': '#181b29',
    '--window-title': '#fff',
    '--wctrl-bg': 'linear-gradient(135deg,#232849 60%,#181b29 100%)',
    '--wctrl-border': '#252840',
    '--wctrl-hover-bg': 'linear-gradient(135deg, #fd3c5a 40%, #e53c5a 100%)',
    '--wctrl-hover-border': '#fd3c5a',
    '--scrollbar-bg': '#232849',
    '--scrollbar-thumb': '#38407a',
    '--text': '#fff',
    '--subtle': '#bbb'
  };
  const light = {
    '--bg': '#f7f7fb',
    '--desk-bg': 'linear-gradient(135deg, #eaeafc 0%, #f9f9f9 100%)',
    '--icon-bg': 'rgba(220,220,230,0.8)',
    '--icon-text': '#333',
    '--taskbar-bg': '#e9e9ee',
    '--taskbar-border': '#b5b5c5',
    '--taskbar-btn-bg': 'linear-gradient(135deg, #f7f7fc 0%, #ececf4 100%)',
    '--taskbar-btn-bg-hover': 'linear-gradient(135deg, #e1e1e7 0%, #ececf4 100%)',
    '--window-bg': '#fff',
    '--window-border': '#ddd',
    '--window-header-bg': 'linear-gradient(90deg, #e5e5f0 0%, #fff 100%)',
    '--window-content-bg': '#fafaff',
    '--window-title': '#222',
    '--wctrl-bg': 'linear-gradient(135deg,#e5e5f0 60%,#fff 100%)',
    '--wctrl-border': '#ccc',
    '--wctrl-hover-bg': 'linear-gradient(135deg, #ff8fa2 40%, #f39fa5 100%)',
    '--wctrl-hover-border': '#fd3c5a',
    '--scrollbar-bg': '#f0f0f8',
    '--scrollbar-thumb': '#d3d3e2',
    '--text': '#222',
    '--subtle': '#888'
  };
  const vars = theme === 'light' ? light : dark;
  for (const key in vars) document.documentElement.style.setProperty(key, vars[key]);
  localStorage.setItem("astra_theme", theme);
}
window.setTheme = setTheme;
(function() {
  const theme = localStorage.getItem('astra_theme') || 'dark';
  setTheme(theme);
})();