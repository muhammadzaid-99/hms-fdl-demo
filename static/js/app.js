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
        <line x1="${x1}" y1="${y1a}" x2="${x2a}" y2="${y2a}"/>
        <line x1="${x1}" y1="${y1b}" x2="${x2b}" y2="${y2b}"/>`;
}
window.addEventListener('load', drawConnectors);
window.addEventListener('resize', drawConnectors);

// ===== HELPERS =====
function comp(iconName, name, desc, cls = 'blue') {
    return `<div class="comp-item">
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

<div class="m-section">
    <div class="m-section-head blue">${icon('globe', 'i-sm')} Portals</div>
    <div class="m-portals">
        ${portal('userPlus', 'Hospital Registration Portal', 'Register &amp; connect hospital nodes. Generates credentials for node backend.', '#HOSPITAL_REGISTRATION_PORTAL_URL')}
        ${portal('shield', 'Admin Portal', 'Monitor federation health, registered nodes, activity &amp; system status.', '#ADMIN_PORTAL_URL')}
        ${portal('search', 'Requester / Researcher Platform', 'Browse datasets, submit data access requests, run federated SQL queries &amp; view AI analytics.', '#REQUESTER_PLATFORM_URL')}
    </div>
</div>

<div class="m-section">
    <div class="m-section-head blue">${icon('server', 'i-sm')} Internal Components</div>
    <div class="comp-grid">
        ${comp('server', 'Central Backend', 'Main application server — auth, business logic, request management')}
        ${comp('globe', 'Central Proxy', 'Internal gateway — routes to Nessie, Trino, hospital MinIO buckets')}
        ${comp('gitBranch', 'Nessie Catalog Server', 'Apache Nessie — Git-like Iceberg metadata catalog (hospital nodes have push-only access)')}
        ${comp('database', 'Nessie PostgreSQL', 'Backing database for Nessie catalog')}
        ${comp('database', 'Central PostgreSQL', 'App database — users, requests, audit logs')}
        ${comp('cpu', 'Trino Engine', 'Distributed SQL query engine — federated queries across hospital data lakes')}
        ${comp('brain', 'Data / AI Analytics Service', 'ML models &amp; AI analytics on federated data', 'purple')}
    </div>
</div>

<div class="m-section">
    <div class="m-section-head blue">${icon('zap', 'i-sm')} Data Flows</div>
    ${flow('f-c-api', 'Portal / API Request Flow', [
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
</div>`;

// ===== HOSPITAL NODE TEMPLATE =====
function hospitalModal(label, sfx, backendUrl, adminUrl, clinicalUrl) {
    return `
<h2 class="m-title teal">Hospital ${label}</h2>
<p class="m-sub">Independent hospital data node — identical deployment, independent credentials &amp; URLs</p>

<div class="m-section">
    <div class="m-section-head teal">${icon('hardDrive', 'i-sm')} Node Infrastructure Layer</div>
    <div class="m-portals cols-1">
        ${portal('monitor', 'Node Backend UI', 'Manage ETL pipelines, configure schedules, view data lake contents, manage federation credentials &amp; review data access requests.', backendUrl, 'teal')}
    </div>
</div>

<div class="m-section">
    <div class="m-section-head teal">${icon('server', 'i-sm')} Infrastructure Components</div>
    <div class="comp-grid">
        ${comp('server', 'Node Backend', 'Core node service — ETL management, credentials, Central Backend polling', 'teal')}
        ${comp('database', 'Node PostgreSQL', 'Node config storage — NOT clinical data', 'teal')}
        ${comp('zap', 'ETL Server', 'Local ETL engine — receives jobs from Node Backend', 'teal')}
        ${comp('hardDrive', 'MinIO Data Lake', 'S3-compatible object storage — Apache Iceberg format', 'teal')}
    </div>
    <div class="partition-box">
        <strong>MinIO Bucket Partitioning:</strong><br>
        └── /{department}/<br>
        &nbsp;&nbsp;&nbsp;&nbsp;└── /{checkup_date}/<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [Iceberg data files]<br><br>
        Data requests scoped by: <strong>Department + Date Range</strong>
    </div>
</div>

<div class="m-section">
    <div class="m-section-head teal">${icon('zap', 'i-sm')} Infrastructure Data Flows</div>
    ${flow('f-' + sfx + '-etl', 'ETL Pipeline Execution Flow', [
        ['Node Backend UI →', 'triggers ETL job'],
        ['Node Backend →', 'ETL Server (local)'],
        ['ETL Server →', 'fetches credentials for clinical DB'],
        ['ETL Server →', 'reads from Clinical PostgreSQL (raw data)'],
        ['ETL Server →', 'transforms data'],
        ['ETL Server →', 'writes Iceberg data to MinIO (dept/date partitions)'],
        ['ETL Server →', 'pushes metadata to Central Nessie Catalog'],
    ], true)}
    ${flow('f-' + sfx + '-req', 'Data Request Management Flow', [
        ['Central Backend →', 'receives data request from requester'],
        ['Node Backend →', 'polls Central Backend for pending requests'],
        ['Node Backend UI →', 'shows pending requests to hospital admin'],
        ['Admin →', 'reviews &amp; approves, issues temp STS credentials'],
        ['Approval + Credentials →', 'sent back to Central Backend'],
        ['Requester Platform →', 'receives access token for scoped Trino query'],
    ], true)}
</div>

<hr class="m-divider">

<div class="m-section">
    <div class="m-section-head teal">${icon('stethoscope', 'i-sm')} Clinical System Layer</div>
    <div class="m-portals cols-2">
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
    <div class="m-section-head teal">${icon('server', 'i-sm')} Clinical Components</div>
    <div class="comp-grid">
        ${comp('server', 'Main Clinical Backend', 'Auth layer &amp; API gateway for all clinical operations', 'teal')}
        ${comp('clipboard', 'Checkups Microservice', 'Patient checkups, appointments &amp; scheduling', 'teal')}
        ${comp('stethoscope', 'Lab Tests Microservice', 'Lab orders, templates, results &amp; pathology workflows', 'teal')}
        ${comp('database', 'Clinical PostgreSQL', 'Clinical data store — source database for ETL pipelines', 'teal')}
    </div>
</div>

<div class="m-section">
    <div class="m-section-head purple">${icon('brain', 'i-sm')} AI Services</div>
    <div class="comp-grid">
        ${comp('mic', 'Transcription Service', 'Speech-to-text pipeline — processes checkup audio recordings into structured transcriptions', 'purple')}
        ${comp('sparkles', 'Clinical Insights Service', 'NLP models — extracts clinical insights, flags anomalies &amp; generates summaries from transcriptions', 'purple')}
    </div>
    <p style="font-size:0.68rem;color:var(--text-muted);margin-top:0.35rem;">AI services connect to Checkups Microservice: Audio → Transcription → Clinical Insights</p>
</div>

<div class="m-section">
    <div class="m-section-head teal">${icon('zap', 'i-sm')} Clinical Data Flow</div>
    ${flow('f-' + sfx + '-clin', 'Clinical System Data Flow', [
        ['Clinical Staff / Admin Portal →', 'Main Clinical Backend (auth + routing)'],
        ['→ Checkups Microservice', '(appointments, checkup records)'],
        ['  → Audio Recording', 'captured during checkup session'],
        ['  → Transcription AI', 'speech-to-text pipeline'],
        ['  → Clinical Insights AI', 'insight extraction from transcription'],
        ['→ Lab Tests Microservice', '(lab orders, templates, results)'],
        ['→ Clinical PostgreSQL', '(data persistence)'],
        ['ETL Pipeline:', 'Clinical PostgreSQL → ETL Server → MinIO Data Lake'],
    ], true)}
</div>`;
}

modalContent['hospital-a'] = hospitalModal('Node A', 'a', '#NODE_A_BACKEND_UI_URL', '#NODE_A_ADMIN_PORTAL_URL', '#NODE_A_CLINICAL_PORTAL_URL');
modalContent['hospital-b'] = hospitalModal('Node B', 'b', '#NODE_B_BACKEND_UI_URL', '#NODE_B_ADMIN_PORTAL_URL', '#NODE_B_CLINICAL_PORTAL_URL');
