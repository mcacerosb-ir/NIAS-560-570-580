document.addEventListener('DOMContentLoaded', function() {
  // ================================================================
  // DATA
  // ================================================================
  const iconoData = [
    { id: 'identificar', title: '1. Identificar', desc: 'Detectar hechos o condiciones que generan dudas sobre la continuidad.', full: 'Durante la ejecución de los procedimientos de auditoría planificados, el auditor debe estar alerta a cualquier información o evento que indique que existen dudas sobre la capacidad de la entidad para continuar como empresa en funcionamiento. Esto incluye pérdidas recurrentes, déficit de liquidez, incumplimiento de obligaciones de deuda, cierre de líneas de crédito, problemas legales significativos, y cambios adversos en el mercado o la regulación.' },
    { id: 'evaluar', title: '2. Evaluar', desc: 'Determinar si la duda es significativa y requiere atención.', full: 'El auditor debe evaluar si los hechos o condiciones identificados generan una duda significativa sobre la continuidad. La evaluación considera la magnitud y probabilidad de los eventos, la capacidad de la entidad para generar flujos de efectivo futuros, la disponibilidad de financiamiento, y la capacidad de la dirección para implementar planes de mitigación efectivos. Se utilizan análisis de ratios, proyecciones y juicio profesional.' },
    { id: 'procedimientos', title: '3. Procedimientos adicionales', desc: 'Diseñar y ejecutar procedimientos de auditoría adicionales.', full: 'Cuando existe duda significativa, el auditor debe diseñar y ejecutar procedimientos adicionales para obtener evidencia suficiente sobre la capacidad de la entidad para continuar. Estos incluyen: análisis detallado de ratios financieros, evaluación de contratos de deuda y líneas de crédito, revisión de planes de reestructuración, análisis de pronósticos de flujos de efectivo, confirmaciones con acreedores, revisión de contratos con clientes clave, y consulta con asesores legales.' },
    { id: 'planes', title: '4. Planes de dirección', desc: 'Evaluar la viabilidad de los planes de mitigación de la dirección.', full: 'El auditor debe evaluar los planes de la dirección para mitigar la duda sobre la continuidad. Esto incluye analizar la viabilidad de los planes de reestructuración, evaluar la probabilidad de venta de activos, revisar la disponibilidad de financiamiento adicional, verificar la factibilidad de negociaciones con acreedores, y analizar la razonabilidad de las hipótesis utilizadas en los pronósticos.' },
    { id: 'pronosticos', title: '5. Pronósticos de flujo', desc: 'Evaluar la fiabilidad de los pronósticos de flujos de efectivo.', full: 'El auditor debe evaluar la fiabilidad de los pronósticos de flujos de efectivo futuros preparados por la dirección. Esto incluye analizar la razonabilidad de las hipótesis de ingresos y gastos, el horizonte temporal utilizado, la consistencia con información histórica, la sensibilidad de los pronósticos ante cambios en hipótesis clave, y la adecuación de las políticas contables utilizadas en la preparación de los pronósticos.' },
    { id: 'conclusion', title: '6. Conclusión', desc: 'Evaluar si la información a revelar es adecuada y determinar el efecto en el informe.', full: 'El auditor debe evaluar si la información revelada en los estados financieros sobre la duda significativa es adecuada y completa. Si la información es adecuada, se emite una opinión sin salvedades con un párrafo de énfasis. Si la información es inadecuada, se emite una opinión adversa. Si la duda es tan significativa que los estados financieros son engañosos, puede ser necesario negar la opinión.' },
  ];

  const timelineData = [
    { title: 'Identificación', desc: 'El auditor identifica hechos o condiciones que generan dudas sobre la continuidad durante la ejecución de procedimientos de auditoría rutinarios.' },
    { title: 'Evaluación', desc: 'Evalúa si la duda es significativa, considerando la magnitud, probabilidad y capacidad de la dirección para mitigar los riesgos identificados.' },
    { title: 'Procedimientos adicionales', desc: 'Diseña y ejecuta procedimientos adicionales: análisis de ratios, evaluación de deuda, revisiones de contratos y pronósticos de flujos.' },
    { title: 'Planes de dirección', desc: 'Evalúa la viabilidad de los planes de mitigación propuestos por la dirección, incluyendo reestructuración, venta de activos y financiamiento.' },
    { title: 'Pronósticos', desc: 'Evalúa la fiabilidad de los pronósticos de flujos de efectivo, analizando hipótesis, horizonte temporal y consistencia con datos históricos.' },
    { title: 'Revelación', desc: 'Determina si la información revelada en los estados financieros es adecuada y completa sobre la duda significativa.' },
    { title: 'Informe', desc: 'Emite el informe de auditoría: sin salvedades con énfasis, salvedades, adversa o negada, según la materialidad y adecuación de la información.' },
  ];

  const flowData = [
    { label: 'Dudas identificadas', desc: 'Se detectan hechos o condiciones que generan dudas sobre la continuidad de la entidad.' },
    { label: 'Duda significativa', desc: 'El auditor evalúa si la duda es significativa. Si no lo es, continúa con la auditoría normal.' },
    { label: 'Procedimientos adicionales', desc: 'Se diseñan y ejecutan procedimientos adicionales para obtener evidencia sobre la viabilidad de la continuidad.' },
    { label: 'Evaluar planes', desc: 'Se evalúan los planes de la dirección y los pronósticos de flujos de efectivo para mitigar la duda.' },
    { label: 'Revelación adecuada', desc: 'Si la revelación es adecuada, se emite opinión con párrafo de énfasis de incertidumbre.' },
    { label: 'Revelación inadecuada', desc: 'Si la revelación es inadecuada, se emite opinión adversa o negada, según la gravedad.' },
  ];

  // ================================================================
  // ICONOGRAPHIC SCHEME
  // ================================================================
  const iconoGrid = document.getElementById('icono-grid');
  const iconoDetail = document.getElementById('icono-detail-panel');
  let currentIcono = null;

  const iconSvgs = [
    '<svg class="icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4Z"/></svg>',
    '<svg class="icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    '<svg class="icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
    '<svg class="icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4Z"/></svg>',
    '<svg class="icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    '<svg class="icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>'
  ];

  function renderIconos() {
    iconoGrid.innerHTML = '';
    iconoData.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'icono-card';
      card.dataset.id = item.id;
      card.innerHTML = iconSvgs[i] + '<h4>' + item.title + '</h4><p>' + item.desc + '</p>';
      card.addEventListener('click', function() {
        if (currentIcono === card) { return; }
        if (currentIcono) { currentIcono.classList.remove('selected'); }
        card.classList.add('selected');
        currentIcono = card;
        iconoDetail.classList.add('show');
        iconoDetail.innerHTML = '<h4>' + item.title + '</h4><p>' + item.full + '</p>';
      });
      iconoGrid.appendChild(card);
    });
  }
  renderIconos();
  // Auto-select first
  iconoGrid.children[0].click();

  // ================================================================
  // TIMELINE
  // ================================================================
  const timelineNodes = document.getElementById('timeline-nodes');
  const timelineProgress = document.getElementById('timeline-progress-bar');
  const timelineDetail = document.getElementById('timeline-detail');
  let currentTimelineIdx = 0;

  function renderTimeline() {
    timelineNodes.innerHTML = '';
    timelineData.forEach((item, i) => {
      const node = document.createElement('div');
      node.className = 'timeline-node' + (i === 0 ? ' active' : '');
      node.innerHTML = '<div class="node-circle">' + (i + 1) + '</div><div class="node-label">' + item.title + '</div>';
      node.addEventListener('click', function() { setTimelineStep(i); });
      timelineNodes.appendChild(node);
    });
    updateTimelineProgress(0);
  }

  function updateTimelineProgress(idx) {
    const nodes = timelineNodes.querySelectorAll('.timeline-node');
    const total = nodes.length - 1;
    const pct = total > 0 ? (idx / total) * 100 : 0;
    timelineProgress.style.width = pct + '%';
  }

  function setTimelineStep(idx) {
    const nodes = timelineNodes.querySelectorAll('.timeline-node');
    nodes.forEach((n, i) => n.classList.toggle('active', i === idx));
    currentTimelineIdx = idx;
    updateTimelineProgress(idx);
    timelineDetail.innerHTML = '<h4>' + timelineData[idx].title + '</h4><p>' + timelineData[idx].desc + '</p>';
  }

  renderTimeline();

  // ================================================================
  // FLOW DIAGRAM
  // ================================================================
  const flowWrap = document.getElementById('flow-wrap');
  const flowDetail = document.getElementById('flow-detail');
  let currentFlowIdx = 0;
  let flowInterval = null;

  function renderFlow() {
    flowWrap.innerHTML = '';
    flowData.forEach((item, i) => {
      const step = document.createElement('div');
      step.className = 'flow-step' + (i === 0 ? ' active' : '');
      step.textContent = item.label;
      step.addEventListener('click', function() { setFlowStep(i); });
      flowWrap.appendChild(step);
      if (i < flowData.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'flow-arrow';
        arrow.textContent = '→';
        flowWrap.appendChild(arrow);
      }
    });
  }

  function setFlowStep(idx) {
    const steps = flowWrap.querySelectorAll('.flow-step');
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    currentFlowIdx = idx;
    flowDetail.innerHTML = '<h4>' + flowData[idx].label + '</h4><p>' + flowData[idx].desc + '</p>';
  }

  renderFlow();
  setFlowStep(0);

  // Flow play button
  document.getElementById('flow-play-btn').addEventListener('click', function() {
    if (flowInterval) { clearInterval(flowInterval); flowInterval = null; this.textContent = '▶ Reproducir flujo'; return; }
    this.textContent = '⏸ Pausar flujo';
    let idx = 0;
    setFlowStep(0);
    flowInterval = setInterval(function() {
      idx = (idx + 1) % flowData.length;
      setFlowStep(idx);
    }, 2000);
    // Auto-stop after one full cycle
    setTimeout(function() { if (flowInterval) { clearInterval(flowInterval); flowInterval = null; document.getElementById('flow-play-btn').textContent = '▶ Reproducir flujo'; } }, flowData.length * 2000 + 100);
  });
});
