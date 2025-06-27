window.WebBrowserApp = function(container) {
  container.innerHTML = `
    <h2>Web Browser</h2>
    <form id="browser-form" style="margin-bottom:12px">
      <input id="browser-url" style="width:78%;padding:6px;" placeholder="Enter URL (e.g. https://example.com)" />
      <button type="submit" style="padding:6px 16px;">Go</button>
    </form>
    <iframe id="browser-frame" style="width:100%;height:calc(100% - 80px);background:#fff;border-radius:8px;border:none;"></iframe>
    <div style="color:#bbb;font-size:0.97em;margin-top:8px;">Note: Some sites may block embedding.</div>
  `;
  const form = container.querySelector("#browser-form");
  const frame = container.querySelector("#browser-frame");
  form.onsubmit = function(e){
    e.preventDefault();
    let url = container.querySelector("#browser-url").value.trim();
    if (!/^https?:\/\//.test(url)) url = "https://" + url;
    frame.src = url;
    return false;
  };
};