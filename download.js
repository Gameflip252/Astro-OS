window.DownloadApp = function(container) {
  container.innerHTML = `
    <h2>Download</h2>
    <form id="dl-form" style="margin-bottom:18px;">
      <input id="dl-url" placeholder="Enter file URL" style="width:65%;padding:6px;">
      <button type="submit" style="padding:6px 16px;">Download</button>
    </form>
    <div id="dl-status" style="margin-bottom:14px;color:#bbb;"></div>
    <div style="font-size:0.96em;color:#888;">File will be added to "Files" app if download is successful.<br>(Some servers may block CORS)</div>
  `;
  const form = container.querySelector("#dl-form");
  const status = container.querySelector("#dl-status");
  form.onsubmit = function(e){
    e.preventDefault();
    let url = container.querySelector("#dl-url").value.trim();
    if (!url) { status.textContent = "Enter a URL."; return false; }
    status.textContent = "Downloading...";
    fetch(url)
      .then(resp => {
        if (!resp.ok) throw new Error("HTTP "+resp.status);
        return resp.blob();
      })
      .then(blob => {
        let fname = url.split("/").pop().split("?")[0] || "downloaded.file";
        let reader = new FileReader();
        reader.onload = function(evt) {
          window.astraDemoFiles = window.astraDemoFiles || [];
          window.astraDemoFileBlobs = window.astraDemoFileBlobs || {};
          window.astraDemoFiles.push(fname);
          window.astraDemoFileBlobs[fname] = URL.createObjectURL(blob);
          status.textContent = "Downloaded and added: "+fname;
        };
        reader.readAsArrayBuffer(blob);
      })
      .catch(err => {
        status.textContent = "Failed: "+err;
      });
    return false;
  };
};