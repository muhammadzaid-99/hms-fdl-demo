/* ========================================================
   Federated Health Data Lake — Architecture Demo
   ======================================================== */

// ===== ICON SVG PATHS (Lucide-style) =====
const I = {
    server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1"/><circle cx="6" cy="18" r="1"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    gitBranch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    hardDrive: '<path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><circle cx="6" cy="16" r="1"/>',
    brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/>',
    userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
    stethoscope: '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
};

function icon(name, cls = '') {
    return `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[name] || ''}</svg>`;
}

// ===== MODAL =====
const overlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');

function openModal(nodeId) {
    const html = modalContent[nodeId];
    if (!html) return;
    modalBody.innerHTML = html;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    bindFlowToggles();
}

function closeModal() {
    overlay.classList.add('hidden');
    document.body.style.overflow = 'hidden'; // main page never scrolls
}

document.getElementById('modal-close').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('.expand-btn').forEach(btn =>
    btn.addEventListener('click', () => openModal(btn.dataset.node))
);

// ===== FLOW TOGGLES =====
function bindFlowToggles() {
    document.querySelectorAll('.flow-toggle').forEach(btn =>
        btn.addEventListener('click', () => {
            const el = document.getElementById(btn.dataset.flow);
            if (!el) return;
            const open = el.classList.toggle('open');
            btn.classList.toggle('active', open);
        })
    );
}

// ===== CONNECTORS (SVG) =====
function drawConnectors() {
    const svg = document.getElementById('connectors-svg');
    const canvas = document.getElementById('canvas');
    const c = document.getElementById('central-node');
    const a = document.getElementById('hospital-a-node');
    const b = document.getElementById('hospital-b-node');
    if (!svg || !c || !a || !b) return;

    const off = canvas.getBoundingClientRect();
    const cR = c.getBoundingClientRect();
    const aR = a.getBoundingClientRect();
    const bR = b.getBoundingClientRect();

    const x1 = cR.right - off.left;
    const y1a = cR.top + cR.height * 0.35 - off.top;
    const y1b = cR.top + cR.height * 0.65 - off.top;
    const x2a = aR.left - off.left;
    const y2a = aR.top + aR.height / 2 - off.top;
    const x2b = bR.left - off.left;
    const y2b = bR.top + bR.height / 2 - off.top;

    svg.setAttribute('width', canvas.scrollWidth);
    svg.setAttribute('height', canvas.scrollHeight);
    svg.innerHTML = `
        <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#2563eb" /> <!-- Blue -->
                <stop offset="100%" stop-color="#0d9488" /> <!-- Teal -->
            </linearGradient>
        </defs>
        <line x1="${x1}" y1="${y1a}" x2="${x2a}" y2="${y2a}"/>
        <line x1="${x1}" y1="${y1b}" x2="${x2b}" y2="${y2b}"/>`;
}
window.addEventListener('load', drawConnectors);
window.addEventListener('resize', drawConnectors);

// ===== HELPERS =====
function comp(iconName, name, desc, cls = 'blue', grid_cols = '1') {
    return `<div class="comp-item ${cls}" style="grid-column: span ${grid_cols}">
        <div class="comp-icon ${cls}">${icon(iconName, 'i-sm')}</div>
        <div><div class="comp-name">${name}</div><div class="comp-desc">${desc}</div></div>
    </div>`;
}

function portal(iconName, name, desc, href, cls = '', extra = '') {
    return `<!-- REPLACE href WITH ACTUAL URL -->
    <a href="${href}" target="_blank" rel="noopener noreferrer" class="m-portal ${cls}">
        <div style="display:flex;align-items:center;gap:0.4rem">${icon(iconName, 'i-sm')}<span class="m-portal-name">${name}</span></div>
        <div class="m-portal-desc">${desc}</div>${extra}
        <span class="m-portal-go">Open Portal →</span>
    </a>`;
}

function flow(id, title, steps, teal = false) {
    const cls = teal ? 'teal-flow' : '';
    const sCls = teal ? 'teal-step' : '';
    return `<button class="flow-toggle ${cls}" data-flow="${id}">${icon('chevron', 'i-sm')} ${title}</button>
    <div class="flow-body" id="${id}">
        ${steps.map(s => `<div class="flow-step ${sCls}"><b>${s[0]}</b> ${s[1] || ''}</div>`).join('')}
    </div>`;
}

// ===== MODAL CONTENT =====
const modalContent = {};

modalContent['central'] = `
<h2 class="m-title blue">Central Control Plane</h2>
<p class="m-sub">Federation orchestration, distributed query engine &amp; administration</p>

<div class="modal-cols">
    <div class="modal-col">
        <div class="m-section">
            <div class="m-section-head blue">${icon('globe', 'i-sm')} Portals</div>
            <div class="m-portals">
                ${portal('userPlus', 'Hospital Registration Portal', 'Register &amp; connect hospital nodes. Generates credentials for node backend.', 'https://central.healthlake.tech/hospital/login')}
                ${portal('shield', 'Admin Portal', 'Monitor federation health, registered nodes, activity &amp; system status.', 'https://central.healthlake.tech')}
                ${portal('search', 'Requester / Researcher Platform', 'Browse datasets, submit data access requests, run federated SQL queries &amp; view AI analytics.', 'https://platform.healthlake.tech')}
            </div>
        </div>

         <div class="m-section">
            <div class="m-section-head blue">${icon('zap', 'i-sm')} Data Flows</div>
            ${flow('f-c-api', 'Metadata Request Flow', [
    ['User Request →', 'Central Backend'],
    ['Central Backend →', 'Central Proxy'],
    ['Central Proxy →', 'Nessie Catalog (metadata lookup)'],
    ['Nessie Catalog →', 'Central Proxy (response)'],
    ['Central Proxy →', 'Central Backend (processed)'],
    ['Central Backend →', 'UI Response'],
])}
            ${flow('f-c-query', 'Federated Query Flow', [
    ['Requester Platform →', 'Central Backend (submit SQL)'],
    ['Central Backend →', 'Central Proxy → Trino Engine'],
    ['Trino →', 'Central Proxy → Nessie (fetch table/partition metadata)'],
    ['Nessie →', 'returns metadata to Trino'],
    ['Trino →', 'Central Proxy → Hospital MinIO Buckets (S3 read)'],
    ['Trino →', 'aggregates results from all nodes'],
    ['Results →', 'Central Backend → Requester Platform UI'],
])}
            ${flow('f-c-approval', 'Data Request Approval Flow', [
    ['Requester →', 'submits data request via Requester Platform'],
    ['Request →', 'saved in Central Backend'],
    ['Hospital Node Backend →', 'polls / fetches pending requests for their node'],
    ['Hospital Admin →', 'reviews &amp; approves, issues temporary STS credentials'],
    ['Approval →', 'sent back to Central Backend'],
    ['Requester →', 'gains scoped data access for Trino query execution'],
])}
            ${flow('f-c-analytics', 'Analytics Data Flow', [
    ['Requester Platform →', 'attaches session ID and sends filter parameters'],
    ['Central Middleware →', 'extracts session ID to guarantee strict data isolation per researcher'],
    ['In-Memory Data Engine →', 'applies dynamic slicing masks to session dataframe (demographics, dates, diagnoses)'],
    ['Analytics (Overview) →', 'computes KPIs, distributions, pivot tables, and rule-based insights'],
    ['Analytics (Trends) →', 'executes time-series forecasting and Z-score anomaly detection'],
    ['Analytics (Explorer) →', 'generates Pearson correlation matrices and KMeans clustering'],
    ['Central API Gateway →', 'serializes data structures and applies cross-origin policies'],
    ['Requester Platform →', 'receives structured insights and renders interactive visualizations'],
])}
            ${flow('f-c-pnp', 'Plug & Play Model Run Flow', [
    ['Frontend →', 'fetches unverified manifest objects'],
    ['Python Server →', 'verifies local model directory; marks online/offline dynamically'],
    ['Frontend →', 'renders dynamic cards/inputs based on manifest type'],
    ['User Submits →', 'requests model inference (passes text/audio/image)'],
    ['Python Server →', 'reads container field (whisper, medgemma, blip, biogpt)'],
    ['Model Handler →', 'lazy-loads model on first run; caches in memory'],
    ['Inference →', 'returns standardized { output: { text } } payload'],
    ['Daemon →', 'unloads model &amp; frees GPU/CPU if idle > 10m'],
])}
        </div>

        </div>
        
        <div class="modal-col">
        <div class="m-section">
            <div class="m-section-head blue">${icon('server', 'i-sm')} Internal Components</div>
            <div class="comp-grid">
            ${comp('server', 'Central Backend', 'Main app server — auth, business logic, request management')}
            ${comp('globe', 'Central Proxy', 'Internal gateway — routes to Nessie, Trino, hospital MinIO buckets')}
            ${comp('gitBranch', 'Nessie Catalog Server', 'Apache Nessie — Git-like Iceberg metadata catalog')}
            ${comp('database', 'Nessie PostgreSQL', 'Backing database for Nessie catalog')}
            ${comp('database', 'Central PostgreSQL', 'App database — users, requests, audit logs')}
            ${comp('cpu', 'Trino Engine', 'Distributed SQL query engine — federated queries')}
            </div>
        </div>
        <div class="m-section">
            <div class="m-section-head purple">${icon('brain', 'i-sm')} AI Services</div>
            <div class="comp-grid" style="grid-template-columns: 1fr;">
                ${comp('brain', 'Data / AI Analytics Service', 'ML models &amp; AI analytics on federated data', 'purple')}
                ${comp('cpu', 'Plug &amp; Play Model Hub', 'VQA &amp; BioGPT — auto-loading dynamic inference routing', 'purple')}
            </div>
        </div>

    </div>
</div>`;

// ===== HOSPITAL NODE TEMPLATE =====
function hospitalModal(label, sfx, backendUrl, adminUrl, clinicalUrl) {
    return `
<h2 class="m-title teal">Hospital ${label}</h2>
<p class="m-sub">Independent hospital data node — identical deployment, independent credentials &amp; URLs</p>

<!-- TABS / LAYER NAV -->
<div class="layer-nav">
    <button class="layer-btn active" onclick="switchLayer('${sfx}', 'clinical')">${icon('stethoscope', 'i-sm')} Clinical System</button>
    <button class="layer-btn" onclick="switchLayer('${sfx}', 'infra')">${icon('hardDrive', 'i-sm')} Node Infrastructure</button>
</div>

<!-- CLINICAL SYSTEM LAYER -->
<div id="layer-${sfx}-clinical" class="layer-content">
    <div class="modal-cols">
        <!-- Col 1: Access & Components -->
        <div class="modal-col">
            <div class="m-section">
                <div class="m-section-head teal">${icon('stethoscope', 'i-sm')} Portals</div>
                <div class="m-portals cols-1">
                    ${portal('shield', 'Admin Portal (Clinical)', 'Hospital system admin — manage users, roles &amp; system configuration.', adminUrl, 'teal')}
                    ${portal('users', 'Clinical Staff Portal', 'Multi-role portal for clinical operations.', clinicalUrl, 'teal', `
                        <div class="role-list">
                            <span class="role-badge">Doctor</span>
                            <span class="role-badge">Patient</span>
                            <span class="role-badge">Receptionist</span>
                            <span class="role-badge">Pathologist</span>
                            <span class="role-badge">Lab Technician</span>
                        </div>`)}
                </div>
            </div>

             <div class="m-section">
                <div class="m-section-head teal">${icon('zap', 'i-sm')} AI &amp; Clinical Data Flows</div>
                ${flow('f-' + sfx + '-transcribe', 'Clinical Transcription Flow', [
        ['Frontend →', 'sends audio file + previous checkup data'],
        ['Python Server →', 'saves temp audio file'],
        ['WhisperHandler →', 'loads Whisper v3 Turbo (GGUF); auto-detects English/Urdu and transcribes'],
        ['MedGemmaHandler →', 'receives transcription; extracts structured 12-field clinical data'],
        ['MedGemmaHandler →', 'runs Gap Analysis to verify missing/incomplete data'],
        ['Python Server →', 'returns { transcription, extracted_info, gap_analysis }'],
    ], true)}
                ${flow('f-' + sfx + '-history', 'Patient History Summarization Flow', [
        ['Frontend →', 'requests checkup history summary (patient + checkup array)'],
        ['Python Server →', 'validates inputs &amp; formats prompt template'],
        ['MedGemmaHandler →', 'synthesizes condition progression, symptom trends &amp; treatment response'],
        ['Python Server →', 'returns structured narrative summary view'],
    ], true)}
                ${flow('f-' + sfx + '-clin', 'Core Clinical System Data Flow', [
        ['Staff Portal →', 'Main Clinical Backend'],
        ['→ Checkups Service', '(appointments, audio recording)'],
        ['  → AI Services', '(transcription &amp; insights)'],
        ['→ Clinical PostgreSQL', '(data persistence)'],
        ['ETL Pipeline:', 'Clinical DB → ETL Server → MinIO Data Lake'],
    ], true)}
            </div>

            </div>
            
            <!-- Col 2: AI & Flows -->
            <div class="modal-col">
            <div class="m-section">
                <div class="m-section-head teal">${icon('server', 'i-sm')} Clinical Components</div>
                <div class="comp-grid">
                    ${comp('server', 'Main Clinical Backend', 'Auth layer &amp; API gateway for operations', 'teal')}
                    ${comp('clipboard', 'Checkups Service', 'Patient checkups, appointments &amp; scheduling', 'teal')}
                    ${comp('clipboard', 'Lab Tests Service', 'Manage lab tests templates, perform tests &amp; store results', 'teal')}
                    ${comp('database', 'Clinical DB', 'Source database for ETL pipelines', 'teal')}
                </div>
            </div>
            <div class="m-section">
                <div class="m-section-head purple">${icon('brain', 'i-sm')} AI Services</div>
                <div class="comp-grid" style="grid-template-columns: 1fr;">
                    ${comp('mic', 'Transcription Service', 'Whisper Large v3 Turbo (GGUF) — converts checkup audio to text', 'purple')}
                    ${comp('sparkles', 'Clinical Insights Service', 'MedGemma 3 1B — extracts 12-field structured clinical data', 'purple')}
                    ${comp('clipboard', 'Patient History Summarization', 'MedGemma — synthesizes longitudinal data from past checkups', 'purple')}
                </div>
            </div>

           
        </div>
    </div>
</div>

<!-- INFRASTRUCTURE LAYER -->
<div id="layer-${sfx}-infra" class="layer-content hidden">
    <div class="modal-cols">
        <!-- Col 1: Access & Components -->
        <div class="modal-col">
            <div class="m-section">
                <div class="m-section-head teal">${icon('hardDrive', 'i-sm')} Portals</div>
                <div class="m-portals cols-1">
                    ${portal('monitor', 'Node Console', 'Manage ETL pipelines, federation credentials &amp; data access requests.', backendUrl, 'teal')}
                </div>
            </div>
             <div class="m-section">
                <div class="m-section-head teal">${icon('zap', 'i-sm')} Infrastructure Data Flows</div>
                ${flow('f-' + sfx + '-etl', 'ETL Pipeline Execution Flow', [
        ['Node Backend UI →', 'triggers ETL job'],
        ['ETL Server →', 'reads from Clinical DB'],
        ['ETL Server →', 'writes Iceberg data to MinIO'],
        ['ETL Server →', 'pushes metadata to Central Nessie Catalog'],
    ], true)}
                ${flow('f-' + sfx + '-req', 'Data Request Management Flow', [
        ['Node Backend →', 'polls pending requests from Central'],
        ['Admin →', 'reviews &amp; approves, issues temp STS credentials'],
        ['Approval →', 'sent back to Central Backend'],
    ], true)}
            </div>
            
        </div>

        <!-- Col 2: Data Flows -->
        <div class="modal-col">
        <div class="m-section">
                <div class="m-section-head teal">${icon('server', 'i-sm')} Infrastructure Components</div>
                <div class="comp-grid">
                    ${comp('server', 'Node Backend', 'ETL management, central polling', 'teal')}
                    ${comp('database', 'Node Config DB', 'Node config storage (no clinical data)', 'teal')}
                    ${comp('zap', 'ETL Server', 'Local ETL engine', 'teal')}
                    ${comp('hardDrive', 'MinIO Data Lake', 'S3 object storage (Apache Iceberg)', 'teal')}
                </div>
                <div class="partition-box">
                    <strong>Data Lake Partitioning:</strong><br>
                    └── /{department}/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;└── /{checkup_date}/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [Iceberg files]<br>
                </div>
            </div>
           
        </div>
    </div>
</div>`;
}

// Helper to switch layers without page reloads/scrolling
window.switchLayer = function (sfx, target) {
    document.getElementById(`layer-${sfx}-clinical`).classList.add('hidden');
    document.getElementById(`layer-${sfx}-infra`).classList.add('hidden');

    document.getElementById(`layer-${sfx}-${target}`).classList.remove('hidden');

    // Toggle active state on buttons
    const btns = document.querySelectorAll('.layer-btn');
    btns.forEach(b => b.classList.remove('active'));

    const activeBtn = Array.from(btns).find(b => b.getAttribute('onclick').includes(target));
    if (activeBtn) activeBtn.classList.add('active');
};

modalContent['hospital-a'] = hospitalModal('Node A', 'a', 'https://console.h1.healthlake.tech', 'https://admin.h1.healthlake.tech', 'https://portal.h1.healthlake.tech');
modalContent['hospital-b'] = hospitalModal('Node B', 'b', 'https://console.h2.healthlake.tech', 'https://admin.h2.healthlake.tech', 'https://portal.h2.healthlake.tech');