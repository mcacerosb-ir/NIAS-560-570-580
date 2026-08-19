/* ========== AUDIO PLAYER PARA NIA ========== */
(function(){
  'use strict';

  /* Referencias a elementos de la pagina NIA */
  var statusEl   = document.getElementById('audio-status');
  var progressEl = document.getElementById('audio-progress-bar');
  var controlsEl = document.getElementById('audio-controls');

  /* Si no hay contenedor de audio, no hacemos nada */
  if (!statusEl || !progressEl || !controlsEl) return;

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
      var btns  = c.querySelectorAll('button');
      if (links.length === 1 && links[0].classList.contains('back-btn')) continue;
      if (c.querySelector('.action-grid')) continue;
      /* Omitimos la propia tarjeta del reproductor de audio (status/controles) */
      if (c.querySelector('#audio-status') || c.querySelector('#audio-controls')) continue;

      var t = c.innerText || c.textContent || '';
      texto += t + '\n\n';
    }
    return texto.trim();
  }

  /* ========== Estado del reproductor ========== */
  var synth = window.speechSynthesis;
  var utterance = null;
  var isPlaying = false;
  var isPaused  = false;
  var progressTimer = null;
  var fullText = '';

  /* ========== UI ========== */
  function crearBotones(){
    controlsEl.innerHTML = '';
    var btnPlay = document.createElement('button');
    btnPlay.className = 'audio-btn play';
    btnPlay.textContent = '▶ Escuchar pagina';
    btnPlay.onclick = togglePlay;

    var btnStop = document.createElement('button');
    btnStop.className = 'audio-btn stop';
    btnStop.textContent = '■ Detener';
    btnStop.onclick = detener;

    controlsEl.appendChild(btnPlay);
    controlsEl.appendChild(btnStop);
    return btnPlay;
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
      btnPlay.textContent = '▶ Reanudar';
      return;
    }
    if (isPlaying && isPaused){
      synth.resume();
      isPaused = false;
      statusEl.textContent = 'Reproduciendo...';
      btnPlay.textContent = '⏸ Pausar';
      return;
    }
    iniciar();
  }

  function iniciar(){
    if (synth.speaking || synth.pending) synth.cancel();

    fullText = extraerTexto();
    if (!fullText){
      statusEl.textContent = 'No hay contenido para leer.';
      return;
    }

    utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = function(){
      isPlaying = true; isPaused = false;
      statusEl.textContent = 'Reproduciendo...';
      btnPlay.textContent = '⏸ Pausar';
      progressEl.style.width = '0%';
      animarProgreso();
    };

    utterance.onend = function(){
      isPlaying = false; isPaused = false;
      statusEl.textContent = 'Completado';
      btnPlay.textContent = '▶ Escuchar pagina';
      progressEl.style.width = '100%';
      clearInterval(progressTimer);
    };

    utterance.onerror = function(e){
      isPlaying = false; isPaused = false;
      statusEl.textContent = 'Error: ' + (e.error || 'desconocido');
      btnPlay.textContent = '▶ Escuchar pagina';
      clearInterval(progressTimer);
    };

    synth.speak(utterance);
  }

  function detener(){
    if (synth) synth.cancel();
    isPlaying = false; isPaused = false;
    statusEl.textContent = 'Detenido';
    btnPlay.textContent = '▶ Escuchar pagina';
    progressEl.style.width = '0%';
    clearInterval(progressTimer);
  }

  function animarProgreso(){
    clearInterval(progressTimer);
    var pc = 0;
    progressTimer = setInterval(function(){
      if (!isPlaying) return;
      pc += 0.5;
      if (pc > 95) pc = 95;
      progressEl.style.width = pc + '%';
    }, 400);
  }

  /* Cancelar al salir de pagina */
  window.addEventListener('beforeunload', function(){
    if (synth) synth.cancel();
    clearInterval(progressTimer);
  });
})();
