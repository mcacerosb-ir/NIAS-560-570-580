/* ========== AUDIO PLAYER PARA NIA ========== */
(function(){
  'use strict';

  /* Referencias a elementos de la pagina NIA */
  var statusEl   = document.getElementById('audio-status');
  var progressEl = document.getElementById('audio-progress-bar');
  var controlsEl = document.getElementById('audio-controls');

  /* Si no hay contenedor de audio, no hacemos nada */
  if (!statusEl || !progressEl || !controlsEl) return;

  /* Limite seguro de caracteres por utterance. Algunos motores de TTS
     (p.ej. TextToSpeech nativo de Android) rechazan o truncan textos
     de mas de ~4000 caracteres, por lo que dividimos el contenido en
     fragmentos y los reproducimos en cola. */
  var MAX_CHUNK = 1800;

  /* ========== Utilidades de texto ========== */
  function extraerTexto(){
    var main = document.querySelector('main');
    if (!main) main = document.body;
    var texto = '';
    var cards = main.querySelectorAll('.card');
    for (var i = 0; i < cards.length; i++){
      var c = cards[i];
      /* Omitimos cards que sean solo botones de navegacion */
      var links = c.querySelectorAll('a');
      if (links.length === 1 && links[0].classList.contains('back-btn')) continue;
      if (c.querySelector('.action-grid')) continue;
      /* Omitimos la propia tarjeta del reproductor de audio (status/controles) */
      if (c.querySelector('#audio-status') || c.querySelector('#audio-controls')) continue;

      var t = c.innerText || c.textContent || '';
      texto += t + '\n\n';
    }
    return texto.trim();
  }

  /* Divide el texto completo en fragmentos <= MAX_CHUNK caracteres,
     respetando primero parrafos y, si un parrafo es demasiado largo,
     dividiendo por oraciones. */
  function dividirEnFragmentos(texto, maxLen){
    var parrafos = texto.split(/\n{2,}/);
    var fragmentos = [];
    var actual = '';

    function agregarPieza(pieza){
      if (!pieza) return;
      if ((actual + '\n\n' + pieza).trim().length > maxLen){
        if (actual) fragmentos.push(actual.trim());
        actual = pieza;
      } else {
        actual = actual ? (actual + '\n\n' + pieza) : pieza;
      }
    }

    for (var i = 0; i < parrafos.length; i++){
      var p = parrafos[i];
      if (p.length > maxLen){
        var oraciones = p.split(/(?<=[.!?])\s+/);
        var sub = '';
        for (var j = 0; j < oraciones.length; j++){
          var s = oraciones[j];
          if ((sub + ' ' + s).trim().length > maxLen){
            if (sub) agregarPieza(sub.trim());
            sub = s;
          } else {
            sub = sub ? (sub + ' ' + s) : s;
          }
        }
        if (sub) agregarPieza(sub.trim());
      } else {
        agregarPieza(p);
      }
    }
    if (actual) fragmentos.push(actual.trim());
    return fragmentos;
  }

  /* ========== Estado del reproductor ========== */
  var synth = window.speechSynthesis;
  var isPlaying = false;
  var isPaused  = false;
  var detenidoManual = false;
  var fragmentos = [];
  var indiceActual = 0;

  /* ========== UI ========== */
  function setEtiquetaPlay(icono, texto){
    btnPlay.setAttribute('aria-label', texto);
    btnPlay.innerHTML = '<span aria-hidden="true">' + icono + '</span> ' + texto;
  }

  function crearBotones(){
    controlsEl.innerHTML = '';
    var play = document.createElement('button');
    play.className = 'audio-btn play';
    play.setAttribute('aria-label', 'Escuchar pagina');
    play.innerHTML = '<span aria-hidden="true">\u25B6</span> Escuchar pagina';
    play.onclick = togglePlay;

    var stop = document.createElement('button');
    stop.className = 'audio-btn stop';
    stop.setAttribute('aria-label', 'Detener lectura');
    stop.innerHTML = '<span aria-hidden="true">\u25A0</span> Detener';
    stop.onclick = detener;

    controlsEl.appendChild(play);
    controlsEl.appendChild(stop);
    return play;
  }

  var btnPlay = crearBotones();

  /* ========== Controles ========== */
  function togglePlay(){
    if (!synth){
      statusEl.textContent = 'TTS no disponible en este navegador.';
      return;
    }
    if (isPlaying && !isPaused){
      synth.pause();
      isPaused = true;
      statusEl.textContent = 'Pausado';
      setEtiquetaPlay('\u25B6', 'Reanudar');
      return;
    }
    if (isPlaying && isPaused){
      synth.resume();
      isPaused = false;
      statusEl.textContent = 'Reproduciendo...';
      setEtiquetaPlay('\u23F8', 'Pausar');
      return;
    }
    iniciar();
  }

  function actualizarProgreso(){
    var pct = fragmentos.length ? Math.round((indiceActual / fragmentos.length) * 100) : 0;
    progressEl.style.width = pct + '%';
  }

  function hablarFragmento(idx){
    if (detenidoManual) return;

    if (idx >= fragmentos.length){
      isPlaying = false; isPaused = false;
      statusEl.textContent = 'Completado';
      setEtiquetaPlay('\u25B6', 'Escuchar pagina');
      progressEl.style.width = '100%';
      return;
    }

    var utterance = new SpeechSynthesisUtterance(fragmentos[idx]);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = function(){
      isPlaying = true; isPaused = false;
      statusEl.textContent = 'Reproduciendo...';
      setEtiquetaPlay('\u23F8', 'Pausar');
      indiceActual = idx;
      actualizarProgreso();
    };

    utterance.onend = function(){
      if (detenidoManual) return;
      indiceActual = idx + 1;
      actualizarProgreso();
      hablarFragmento(indiceActual);
    };

    utterance.onerror = function(e){
      if (detenidoManual) return;
      isPlaying = false; isPaused = false;
      statusEl.textContent = 'Error: ' + (e.error || 'desconocido');
      setEtiquetaPlay('\u25B6', 'Escuchar pagina');
    };

    synth.speak(utterance);
  }

  function iniciar(){
    detenidoManual = false;
    if (synth.speaking || synth.pending) synth.cancel();

    var fullText = extraerTexto();
    if (!fullText){
      statusEl.textContent = 'No hay contenido para leer.';
      return;
    }

    fragmentos = dividirEnFragmentos(fullText, MAX_CHUNK);
    indiceActual = 0;
    progressEl.style.width = '0%';
    hablarFragmento(0);
  }

  function detener(){
    detenidoManual = true;
    if (synth) synth.cancel();
    isPlaying = false; isPaused = false;
    statusEl.textContent = 'Detenido';
    setEtiquetaPlay('\u25B6', 'Escuchar pagina');
    progressEl.style.width = '0%';
  }

  /* Cancelar al salir de pagina */
  window.addEventListener('beforeunload', function(){
    detenidoManual = true;
    if (synth) synth.cancel();
  });
})();
