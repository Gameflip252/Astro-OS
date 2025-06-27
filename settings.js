window.SettingsApp = function(container) {
  // HTML
  container.innerHTML = `
    <h2>Settings</h2>
    <div style="margin:18px 0 4px 0;font-weight:500;">Desktop Theme:</div>
    <select id="theme-select" style="padding:6px 18px;border-radius:7px;">
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
    <div style="margin:18px 0 4px 0;font-weight:500;">Desktop Background:</div>
    <div style="margin-bottom:12px;">
      <input type="color" id="bg-color" title="Pick color" value="#232943">
      <span style="margin-left:8px;"></span>
      <input type="file" id="bg-upload" accept="image/*">
      <label for="bg-upload" style="margin-left:8px;">Upload Image</label>
      <button id="bg-reset" style="margin-left:16px;">Reset</button>
    </div>
    <div style="margin:26px 0 4px 0;font-weight:500;">Specs:</div>
    <div id="specs"></div>
    <div style="margin:26px 0 4px 0;font-weight:500;">Audio Output Devices:</div>
    <div id="audio-devices" style="margin-bottom:8px;">Detecting...</div>
    <button id="audio-picker" style="background:#38407a;color:#fff;border:none;border-radius:7px;padding:6px 16px;margin-bottom:16px;">Pick Output</button>
    <div id="audio-picked" style="color:#8f8;font-size:0.97em;margin-top:4px;"></div>
  `;

  // Theme (desktop UI only)
  const themeSel = container.querySelector("#theme-select");
  themeSel.value = localStorage.getItem("astra_theme") || "dark";
  themeSel.onchange = function() {
    if (typeof setTheme === "function") setTheme(themeSel.value);
    else alert('Theme switching not available');
  };

  // Background color
  const colorInput = container.querySelector("#bg-color");
  colorInput.onchange = function() {
    if (typeof setDesktopBgColor === "function") setDesktopBgColor(colorInput.value);
    else document.getElementById('desktop-bg').style.background = colorInput.value;
  };

  // Background image
  const bgUpload = container.querySelector("#bg-upload");
  bgUpload.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      if (typeof setDesktopBgImage === "function") setDesktopBgImage(evt.target.result);
      else document.getElementById('desktop-bg').style.background = `url('${evt.target.result}') no-repeat center center/cover`;
    };
    reader.readAsDataURL(file);
  };

  // Reset background
  container.querySelector("#bg-reset").onclick = function() {
    document.getElementById('desktop-bg').style.background = '';
    localStorage.removeItem('astra_desktop_bg_image');
    localStorage.removeItem('astra_desktop_bg_color');
  };

  // Specs
  const specs = [];
  specs.push("OS: " + (navigator.platform || "Unknown"));
  specs.push("User Agent: " + (navigator.userAgent || "Unknown"));
  specs.push("Screen: " + window.screen.width + "x" + window.screen.height + " px");
  if (navigator.deviceMemory) specs.push("RAM: " + navigator.deviceMemory + " GB");
  specs.push("Language: " + navigator.language);
  try { specs.push("Cores: " + (navigator.hardwareConcurrency || "?")); } catch {}
  container.querySelector("#specs").innerHTML = specs.map(x => "<div>" + x + "</div>").join("");

  // Audio Output
  const audioDiv = container.querySelector("#audio-devices");
  const audioPicked = container.querySelector("#audio-picked");
  let audioDevices = [];
  let currentAudioDeviceId = localStorage.getItem("astra_audio_output") || "";

  function showPickedDevice() {
    if (!currentAudioDeviceId) {
      audioPicked.textContent = "(Default browser audio output)";
      return;
    }
    const device = audioDevices.find(d => d.deviceId === currentAudioDeviceId);
    if (device) {
      audioPicked.textContent = "Current: " + (device.label || device.deviceId);
    } else {
      audioPicked.textContent = "(Selected device unavailable, using default)";
    }
  }

  // List devices
  function refreshAudioDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        audioDevices = devices.filter(d => d.kind === "audiooutput");
        if (audioDevices.length)
          audioDiv.innerHTML = audioDevices.map(d => d.label || d.deviceId).join("<br>");
        else
          audioDiv.innerHTML = "(No audio output devices found)";
        showPickedDevice();
      }).catch(() => {
        audioDiv.textContent = "Unable to detect audio outputs.";
      });
    } else {
      audioDiv.textContent = "Not supported.";
    }
  }
  refreshAudioDevices();

  // Audio picker
  container.querySelector("#audio-picker").onclick = function() {
    if (!audioDevices.length) { alert('No audio output devices found.'); return; }
    let labelList = audioDevices.map((d,i)=>`${i+1}. ${d.label||d.deviceId}`).join("\n");
    let pick = prompt("Pick output device:\n"+labelList+"\nEnter number of device:");
    pick = parseInt(pick);
    if (pick > 0 && pick <= audioDevices.length) {
      currentAudioDeviceId = audioDevices[pick-1].deviceId;
      localStorage.setItem("astra_audio_output", currentAudioDeviceId);
      showPickedDevice();
      // Set all video/audio tags to use this device
      setTimeout(()=>{
        const vids = document.querySelectorAll("video,audio");
        vids.forEach(media=>{
          if (typeof media.setSinkId === "function") {
            media.setSinkId(currentAudioDeviceId).catch(()=>{});
          }
        });
      }, 500);
      alert('Audio output set. Re-open videos to apply.');
    }
  };

  // Try to set sinkId on all existing audio/video tags on open
  setTimeout(()=>{
    const vids = document.querySelectorAll("video,audio");
    vids.forEach(media=>{
      if (typeof media.setSinkId === "function" && currentAudioDeviceId) {
        media.setSinkId(currentAudioDeviceId).catch(()=>{});
      }
    });
    showPickedDevice();
  }, 600);
};