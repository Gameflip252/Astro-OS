window.astraDemoFiles = window.astraDemoFiles || [
  "demo.txt",
  "notes.docx",
  "short.mp4"
];
window.astraDemoFileBlobs = window.astraDemoFileBlobs || {};

window.FileManagerApp = function(container) {
  // Defensive: clear container
  container.innerHTML = "";

  // Ensure files and blobs exist
  let files = window.astraDemoFiles;
  let blobs = window.astraDemoFileBlobs;

  function reload() {
    container.innerHTML = `
      <h2>File Manager</h2>
      <ul id="user-files">${files.map((f, i) => `<li>
        <span>${f}</span>
        <button data-i="${i}" class="del-btn" style="margin-left:14px;">Delete</button>
        <button data-i="${i}" class="ren-btn" style="margin-left:6px;">Rename</button>
        ${blobs[f] ? `<a href="${blobs[f]}" download="${f}" style="margin-left:8px;color:#6df;">Download</a>` : ""}
      </li>`).join('')}</ul>
      <form id="add-file-form" style="margin-top:28px">
        <input id="add-file-input" placeholder="New file name" required style="padding:6px 12px;font-size:1em;border-radius:7px;border:none;"/>
        <button type="submit" style="margin-left:10px;padding:6px 16px;border-radius:7px;background:#38407a;color:#fff;border:none;">Add File</button>
      </form>
      <form id="upload-file-form" style="margin-top:12px;">
        <input type="file" id="upload-file-input" style="color:#fff;">
      </form>
    `;

    // Add file by name (dummy)
    const addForm = container.querySelector('#add-file-form');
    if (addForm) {
      addForm.onsubmit = function(e) {
        e.preventDefault();
        const v = container.querySelector('#add-file-input').value.trim();
        if (v && files.indexOf(v) === -1) {
          files.push(v);
          reload();
        }
        return false;
      };
    }

    // Delete
    Array.from(container.querySelectorAll('.del-btn')).forEach(btn => {
      btn.onclick = function() {
        const i = parseInt(btn.getAttribute('data-i'));
        if (confirm("Delete file '" + files[i] + "'?")) {
          if (blobs[files[i]]) delete blobs[files[i]];
          files.splice(i, 1);
          reload();
        }
      };
    });

    // Rename
    Array.from(container.querySelectorAll('.ren-btn')).forEach(btn => {
      btn.onclick = function() {
        const i = parseInt(btn.getAttribute('data-i'));
        const old = files[i];
        const newName = prompt("Rename file:", old);
        if (newName && newName !== old && !files.includes(newName)) {
          files[i] = newName;
          if (blobs[old]) {
            blobs[newName] = blobs[old];
            delete blobs[old];
          }
          reload();
        }
      };
    });

    // Upload
    const uploadInput = container.querySelector('#upload-file-input');
    if (uploadInput) {
      uploadInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        files.push(file.name);
        blobs[file.name] = url;
        reload();
      };
    }
  }

  reload();
};