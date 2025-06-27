window.TerminalApp = function(container) {
  container.innerHTML = `
    <h2 style="margin-bottom:12px;">Terminal</h2>
    <pre id="term-out" style="background:#101521;padding:12px 9px;height:180px;overflow:auto;border-radius:8px;"></pre>
    <form id="term-form" autocomplete="off" style="margin-top:10px;">
      <span style="color:#5af;">$</span>
      <input id="term-input" style="width:72%;background:#222;border:none;color:#fff;padding:7px 9px;font-family:monospace;font-size:1em;border-radius:7px;" />
      <button type="submit" style="padding:7px 16px;border-radius:7px;background:#38407a;color:#fff;border:none;margin-left:10px;">Run</button>
    </form>
  `;
  const out = container.querySelector("#term-out");
  const form = container.querySelector("#term-form");
  const input = container.querySelector("#term-input");
  out.textContent = "Astra Terminal\nType 'help' for commands.\n";
  form.onsubmit = function(e){
    e.preventDefault();
    const cmd = input.value.trim();
    input.value = "";
    let res = "";
    if (cmd === "help") {
      res = "help - Show this help\nwhoami - Show your username\nfiles - List your files\nclear - Clear terminal";
    } else if (cmd === "whoami") {
      res = "guest";
    } else if (cmd === "files") {
      const files = window.astraDemoFiles || [];
      res = files.length ? files.join("\n") : "(no files)";
    } else if (cmd === "clear") {
      out.textContent = "";
      return false;
    } else {
      res = "Unknown command. Type 'help'.";
    }
    out.textContent += "\n$ " + cmd + "\n" + res + "\n";
    out.scrollTop = out.scrollHeight;
    return false;
  };
};