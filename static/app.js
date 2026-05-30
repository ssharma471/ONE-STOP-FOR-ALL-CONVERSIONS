let TOOLS = [];
let currentTool = null;

async function init(){
  TOOLS = await (await fetch('/api/tools')).json();
  document.getElementById('toolCount').textContent = TOOLS.length;
  document.getElementById('workingCount').textContent = TOOLS.filter(t=>t.status==='working').length;
  renderCategorySections();
  renderTools();
  renderQuickLinks();
}

function toggleMobile(){ document.getElementById('mobileDrawer').classList.toggle('show'); }

function renderQuickLinks(){
  const ids = ['word-to-pdf','compress-pdf','remove-background','youtube-thumbnail-downloader','qr-code-generator'];
  document.getElementById('quick').innerHTML = ids.map(id=>{
    const t = TOOLS.find(x=>x.id===id);
    return t ? `<a class="chip" onclick="openTool('${id}')">${t.name}</a>` : '';
  }).join('');
}

function sectionTitle(cat){
  const titles = {
    'PDF':'PDF tools',
    'Document':'Document tools',
    'GIF':'GIF tools',
    'Image':'Image tools',
    'Video':'Video tools',
    'Audio':'Audio tools',
    'Social Media':'Social media tools',
    'Developer':'Developer tools',
    'AI Tools':'AI tools',
    'Business':'Business tools'
  };
  return titles[cat] || `${cat} tools`;
}

function sectionCopy(cat){
  const copy = {
    'PDF':'Convert, merge, split, compress, rotate, OCR, protect, and manage PDFs.',
    'Document':'Convert Word, Excel, PowerPoint, text, Markdown, HTML, EPUB, and CSV files.',
    'GIF':'Create, convert, resize, compress, and extract GIF animations.',
    'Image':'Convert, compress, resize, upscale, crop, and edit images.',
    'Video':'Video conversion, compression, trimming, GIFs, subtitles, and audio extraction.',
    'Audio':'Audio conversion, trimming, compression, merging, and noise cleanup tools.',
    'Social Media':'Download and process allowed social media content without bypassing restrictions.',
    'Developer':'Format, encode, convert, and generate data utilities quickly.',
    'AI Tools':'AI-powered document and image tools ready for future API integration.',
    'Business':'Business generators and document helpers for daily work.'
  };
  return copy[cat] || '';
}

function renderCategorySections(){
  const categories = ['PDF','Document','Image','GIF','Video','Audio','Social Media','Developer','AI Tools','Business'];
  document.getElementById('categorySections').innerHTML = categories.map(cat => `
    <section class="section" id="${cat.replaceAll(' ','-')}">
      <div class="container">
        <div class="section-head">
          <div><div class="label">${cat}</div><h2>${sectionTitle(cat)}</h2></div>
          <p>${sectionCopy(cat)}</p>
        </div>
        ${cat==='Social Media' ? `<div class="notice">Only download content you own, have permission to use, or are legally allowed to download. This tool does not bypass private accounts, paywalls, DRM, login restrictions, or copyright protections.</div>` : ''}
        <div class="tools-grid" data-category="${cat}"></div>
      </div>
    </section>
  `).join('');
}

function badge(t){
  return `<span class="badge ${t.status==='working'?'working':'soon'}">${t.status==='working'?'Working':'Coming soon'}</span>`;
}

function initials(name){
  return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
}

function card(t){
  return `<div class="tool-card ${t.status==='coming-soon'?'disabled-card':''}">
    <div class="tool-top"><span class="icon">${initials(t.name)}</span>${badge(t)}</div>
    <h3>${t.name}</h3>
    <p>${t.description}</p>
    <a class="open" onclick="openTool('${t.id}')">Open Tool →</a>
  </div>`;
}

function renderTools(){
  const q = (document.getElementById('search')?.value || '').toLowerCase();
  const matches = TOOLS.filter(t => (t.name + t.description + t.category).toLowerCase().includes(q));
  document.getElementById('popularGrid').innerHTML = matches.filter(t=>t.popular).slice(0,12).map(card).join('');
  document.querySelectorAll('[data-category]').forEach(el=>{
    const cat = el.dataset.category;
    el.innerHTML = matches.filter(t=>t.category===cat).map(card).join('');
  });
}

function showHome(){
  document.getElementById('home').style.display = 'block';
  document.getElementById('toolPage').style.display = 'none';
  window.scrollTo({top:0,behavior:'smooth'});
}

function goToSection(id){
  document.getElementById('home').style.display = 'block';
  document.getElementById('toolPage').style.display = 'none';
  setTimeout(()=>{
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    const drawer = document.getElementById('mobileDrawer');
    if(drawer) drawer.classList.remove('show');
  }, 80);
}

function openTool(id){
  currentTool = TOOLS.find(t=>t.id===id);
  document.getElementById('home').style.display = 'none';
  document.getElementById('toolPage').style.display = 'block';
  document.getElementById('toolCategory').textContent = currentTool.category;
  document.getElementById('toolTitle').textContent = currentTool.name;
  document.getElementById('toolDesc').textContent = currentTool.description;
  document.getElementById('compliance').classList.toggle('hidden', currentTool.category !== 'Social Media');
  renderInput();
  document.getElementById('relatedTools').innerHTML = TOOLS
    .filter(t=>t.category===currentTool.category && t.id!==currentTool.id)
    .slice(0,8)
    .map(t=>`<a class="chip" onclick="openTool('${t.id}')">${t.name}</a>`)
    .join('');
  window.scrollTo(0,0);
}

function renderInput(){
  let html='';
  if(currentTool.input==='file' || currentTool.input==='multi-file'){
    html = `<label class="drop">
      <b>Upload file${currentTool.input==='multi-file'?'s':''}</b>
      <span>${currentTool.accept || 'Supported files'}</span>
      <input onchange="showSelectedFiles(this)" style="display:none" type="file" ${currentTool.input==='multi-file'?'multiple':''} name="${currentTool.input==='multi-file'?'files':'file'}" accept="${currentTool.accept}">
    </label>
    <div id="selectedBox" class="selected-box"></div>`;
  }else if(currentTool.input==='url'){
    html = `<div class="field"><label>Paste URL</label><input name="url" placeholder="https://..." required></div>`;
  }else{
    html = `<div class="field"><label>Input</label><textarea name="text" placeholder="Paste your text here..."></textarea></div>`;
  }

  document.getElementById('inputArea').innerHTML = html;

  let options='';
  if(currentTool.id==='image-converter') options += `<div class="field"><label>Output format</label><select name="output_format"><option>jpg</option><option>png</option><option>webp</option><option>pdf</option></select></div>`;
  if(currentTool.id==='image-compressor') options += `<div class="field"><label>Quality</label><input name="quality" value="70" type="number" min="10" max="95"></div>`;
  if(currentTool.id==='image-resizer') options += `<div class="field"><label>Width</label><input name="width" type="number" placeholder="800"></div><div class="field"><label>Height</label><input name="height" type="number" placeholder="600"></div>`;
  if(currentTool.id==='split-pdf') options += `<div class="field"><label>Page range optional</label><input name="page_range" placeholder="1-3,5"></div>`;
  if(currentTool.id==='rotate-pdf') options += `<div class="field"><label>Rotate degrees</label><select name="rotate"><option>90</option><option>180</option><option>270</option></select></div>`;
  if(currentTool.id==='json-formatter') options += `<div class="field"><label>Mode</label><select name="mode"><option value="format">Format</option><option value="minify">Minify</option></select></div>`;
  if(['image-watermark'].includes(currentTool.id)) options += `<div class="field"><label>Watermark text</label><input name="text" placeholder="ONE STOP"></div>`;
  if(['crop-image','image-resizer'].includes(currentTool.id)) options += options.includes('Width') ? '' : `<div class="field"><label>Width</label><input name="width" type="number" placeholder="600"></div><div class="field"><label>Height</label><input name="height" type="number" placeholder="600"></div>`;
  if(['video-trimmer','audio-trimmer'].includes(currentTool.id)) options += `<div class="field"><label>Start</label><input name="page_range" placeholder="00:00:03"></div><div class="field"><label>Duration</label><input name="mode" placeholder="00:00:10"></div>`;
  if(['protect-pdf','unlock-pdf'].includes(currentTool.id)) options += `<div class="field"><label>Password</label><input name="text" type="password" placeholder="Enter password"></div>`;
  if(['watermark-pdf','sign-pdf'].includes(currentTool.id)) options += `<div class="field"><label>Text</label><input name="text" placeholder="Watermark or signature text"></div>`;
  if(['video-trimmer','audio-trimmer'].includes(currentTool.id)) options += `<div class="field"><label>Start time</label><input name="page_range" placeholder="00:00:03"></div><div class="field"><label>Duration / End</label><input name="mode" placeholder="00:00:10"></div>`;
  if(['video-converter'].includes(currentTool.id)) options += `<div class="field"><label>Output format</label><select name="output_format"><option>mp4</option><option>webm</option><option>mov</option></select></div>`;
  if(['mp3-converter','extract-audio'].includes(currentTool.id)) options += `<div class="field"><label>Output format</label><select name="output_format"><option>mp3</option><option>wav</option><option>aac</option></select></div>`;
  if(['crop-image'].includes(currentTool.id)) options += `<div class="field"><label>Width</label><input name="width" type="number" placeholder="600"></div><div class="field"><label>Height</label><input name="height" type="number" placeholder="600"></div>`;

  document.getElementById('optionsArea').innerHTML = options;
  document.getElementById('resultArea').innerHTML = '';
  document.getElementById('processBtn').textContent = currentTool.status==='working' ? 'Process' : 'Coming Soon';
  document.getElementById('processBtn').disabled = currentTool.status !== 'working';
  document.getElementById('processBtn').classList.toggle('disabled-btn', currentTool.status !== 'working');
  if(currentTool.status !== 'working'){
    document.getElementById('resultArea').innerHTML = `<div class="notice"><b>Coming Soon:</b> ${escapeHtml(currentTool.comingSoonReason || 'This tool is planned for the next version.')}</div>`;
  }
}

function formatFileSize(bytes){
  if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function showSelectedFiles(input){
  const box = document.getElementById('selectedBox');
  if(!box) return;
  const files = Array.from(input.files || []);
  if(!files.length){
    box.classList.remove('show');
    box.innerHTML='';
    return;
  }
  const total = files.reduce((s,f)=>s+f.size,0);
  const first = files[0];
  const ext = (first.name.split('.').pop() || 'FILE').toUpperCase().slice(0,5);
  const title = files.length === 1 ? first.name : `${files.length} files selected`;
  const subtitle = files.length === 1 ? `${formatFileSize(first.size)} · Ready to convert` : `${formatFileSize(total)} total · Ready to convert`;
  box.innerHTML = `<div class="file-mini-icon">${ext}</div>
    <div class="selected-meta">
      <div class="selected-name" title="${escapeAttr(title)}">${escapeHtml(title)}</div>
      <div class="selected-size">${subtitle}</div>
      <div class="convert-ready">Now click Process to continue</div>
    </div>
    <button type="button" class="selected-remove" onclick="clearSelectedFiles()">Remove</button>`;
  box.classList.add('show');
}

function clearSelectedFiles(){
  const input = document.querySelector('#inputArea input[type=file]');
  const box = document.getElementById('selectedBox');
  if(input) input.value = '';
  if(box){ box.classList.remove('show'); box.innerHTML=''; }
}

document.getElementById('toolForm').addEventListener('submit', async e=>{
  e.preventDefault();

  const result = document.getElementById('resultArea');
  const fileInput = document.querySelector('#inputArea input[type=file]');
  if(fileInput && !fileInput.files.length){
    result.innerHTML = `<div class="notice">Please select a file first.</div>`;
    return;
  }

  if(currentTool.action === 'base64' || currentTool.action === 'url_encoder'){
    const value = new FormData(e.target).get('text') || '';
    const output = currentTool.action === 'base64' ? btoa(unescape(encodeURIComponent(value))) : encodeURIComponent(value);
    result.innerHTML = `<pre class="result">${escapeHtml(output)}</pre>`;
    return;
  }

  if(currentTool.status !== 'working'){
    result.innerHTML = `<div class="notice">${currentTool.name} is included in the UI. This tool is available in safe MVP mode. Some advanced processing may require FFmpeg, LibreOffice, Ghostscript, or an AI API key.</div>`;
    return;
  }

  const loading = document.getElementById('loading');
  loading.classList.remove('hidden');
  result.innerHTML = '';

  try{
    const res = await fetch('/api/process/' + currentTool.id, {method:'POST', body:new FormData(e.target)});
    if(!res.ok){
      const err = await res.json().catch(()=>({detail:'Processing failed'}));
      throw new Error(err.detail || 'Processing failed');
    }

    const ct = res.headers.get('content-type') || '';
    if(ct.includes('application/json')){
      const data = await res.json();
      if(data.thumbnails){
        result.innerHTML = Object.entries(data.thumbnails).map(([k,u])=>`<p><b>${k}</b>: <a href="${u}" target="_blank">${u}</a></p>`).join('');
      }else{
        result.innerHTML = `<pre class="result">${escapeHtml(data.output || JSON.stringify(data,null,2))}</pre>`;
      }
    }else{
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const cd = res.headers.get('content-disposition') || '';
      const m = cd.match(/filename="([^"]+)"/);
      const filename = m ? m[1] : 'download';
      result.innerHTML = `<a class="download" href="${url}" download="${filename}">Download ${filename}</a>`;
    }
  }catch(err){
    result.innerHTML = `<div class="notice">${escapeHtml(err.message)}</div>`;
  }finally{
    loading.classList.add('hidden');
  }
});

function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function escapeAttr(s){return escapeHtml(s).replace(/`/g,'&#096;');}

init();
