// === Popup de Acciones ===
document.addEventListener('DOMContentLoaded', function() {
  const accionesBtn = document.getElementById('acciones-max');
  const popup = document.getElementById('acciones-popup');
  const closePopup = document.getElementById('close-acciones-popup');
  const accionesLista = document.getElementById('acciones-lista');
  const addAccionBtn = document.getElementById('add-accion-btn');
  let acciones = [];

  if (accionesBtn && popup && closePopup && accionesLista && addAccionBtn) {
    accionesBtn.addEventListener('dblclick', function() {
      popup.style.display = 'block';
      renderAcciones();
    });
    closePopup.onclick = () => popup.style.display = 'none';
    window.addEventListener('click', function(e) {
      if (e.target === popup) popup.style.display = 'none';
    });
    addAccionBtn.onclick = function() {
      const nombre = prompt('Nombre de la acción:');
      if (nombre) {
        acciones.push(nombre);
        renderAcciones();
      }
    };
    function renderAcciones() {
      accionesLista.innerHTML = '';
      acciones.forEach((a, i) => {
        const li = document.createElement('li');
        li.textContent = a;
        const del = document.createElement('button');
        del.textContent = '✕';
        del.style.background = '#ff5252';
        del.style.color = '#fff';
        del.style.border = 'none';
        del.style.borderRadius = '6px';
        del.style.cursor = 'pointer';
        del.style.marginLeft = '8px';
        del.onclick = () => { acciones.splice(i,1); renderAcciones(); };
        li.appendChild(del);
        accionesLista.appendChild(li);
      });
    }
  }
});
// === Rareza Badge Visual ===
function getRarezaBadgeClass(rareza) {
  switch ((rareza||'').toLowerCase()) {
    case 'intrinseca': return 'rareza-badge-intrinseca';
    case 'comun': return 'rareza-badge-comun';
    case 'epica': return 'rareza-badge-epica';
    case 'legendaria': return 'rareza-badge-legendaria';
    case 'mitica': return 'rareza-badge-mitica';
    case 'genesis': return 'rareza-badge-genesis';
    default: return '';
  }
}

function getRarezaLabel(rareza) {
  switch ((rareza||'').toLowerCase()) {
    case 'intrinseca': return 'Intrínseca';
    case 'comun': return 'Común';
    case 'epica': return 'Épica';
    case 'legendaria': return 'Legendaria';
    case 'mitica': return 'Mítica';
    case 'genesis': return 'Génesis';
    default: return rareza||'';
  }
}

function updateRarezaBadgeInput() {
  const input = document.getElementById('modal-item-rareza');
  const badge = document.getElementById('modal-item-rareza-badge');
  if (!input || !badge) return;
  const val = input.value.trim();
  badge.className = 'rareza-badge ' + getRarezaBadgeClass(val);
  badge.textContent = getRarezaLabel(val);
  badge.style.display = val ? 'inline-block' : 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('modal-item-rareza');
  if (input) {
    input.addEventListener('input', updateRarezaBadgeInput);
    // Inicializar badge si ya hay valor
    updateRarezaBadgeInput();
  }
});

// Si abres el modal y rellenas el input, actualiza el badge
function showModalItemWithRareza(rareza) {
  const input = document.getElementById('modal-item-rareza');
  if (input) {
    input.value = rareza || '';
    updateRarezaBadgeInput();
  }
}
// script.js

const defaultCharacter = {
    name: '',
    race: '',
    languages: '',
    personality: '',
    image: '',
    attributes: {
        fuerza: 10,
        inteligencia: 10,
        agilidad: 10,
        metabolismo: 10,
        am: 10
    },
    modifiers: {
        fuerza: 0,
        inteligencia: 0,
        agilidad: 0,
        metabolismo: 0,
        am: 0
    },
    base: {
        vida: 10,
        armadura: 0,
        mistyculas: 5
    },
    stats: {
        vidaMax: 20,
        vida: 20,
        armadura: 0,
        mistyculasMax: 10,
        mistyculas: 10,
        xpComun: 0,
        nivel: 1
    },
    combat: {
        acciones: 3,
        grupoAccion: '',
        efectos: [],
        buffs: [],
        debuffs: []
    },
    inventory: {
        objetos: [],
        habilidades: [],
        tecnicas: [],
        hechizos: [],
        mascotas: [],
        equipamiento: []
    }
};

let character = JSON.parse(JSON.stringify(defaultCharacter));

function calcModifier(attr) {
    return Math.floor((attr - 10) / 2);
}

function updateModifiers() {
    for (let key in character.attributes) {
        character.modifiers[key] = calcModifier(character.attributes[key]);
    }
}

function updateStats() {
    // Vida y Mistyculas máximas pueden depender de atributos y base
    character.stats.vidaMax = (character.base.vida || 10) + character.attributes.metabolismo * 2 + (character.modifiers.metabolismo);
    character.stats.mistyculasMax = (character.base.mistyculas || 5) + character.attributes.am + character.modifiers.am;
    character.stats.armadura = character.base.armadura || 0;
    if (character.stats.vida > character.stats.vidaMax) character.stats.vida = character.stats.vidaMax;
    if (character.stats.mistyculas > character.stats.mistyculasMax) character.stats.mistyculas = character.stats.mistyculasMax;
}
// --- MODAL BASES ---
function showBaseModal() {
    document.getElementById('base-modal').style.display = 'flex';
    document.getElementById('base-vida').value = character.base.vida;
    document.getElementById('base-armadura').value = character.base.armadura;
    document.getElementById('base-mistyculas').value = character.base.mistyculas;
}
function hideBaseModal() {
    document.getElementById('base-modal').style.display = 'none';
}
function saveBaseValues() {
    character.base.vida = parseInt(document.getElementById('base-vida').value)||10;
    character.base.armadura = parseInt(document.getElementById('base-armadura').value)||0;
    character.base.mistyculas = parseInt(document.getElementById('base-mistyculas').value)||5;
    updateStats();
    renderCharacter();
    hideBaseModal();
}
// --- MODAL EFECTOS ---
function showEfectosModal() {
    document.getElementById('efectos-modal').style.display = 'flex';
    renderEfectosModal();
}
function hideEfectosModal() {
    document.getElementById('efectos-modal').style.display = 'none';
}
function renderEfectosModal() {
    const cont = document.getElementById('efectos-lista-modal');
    cont.innerHTML = '';
    const tipo = document.getElementById('efecto-tipo').value;
    let lista = [];
    if(tipo==='buffo') lista = character.combat.buffs;
    else if(tipo==='debuffo') lista = character.combat.debuffs;
    else lista = character.combat.efectos;
    lista.forEach((ef, idx) => {
        const div = document.createElement('div');
        div.className = 'efecto-item';
        div.innerHTML = `<b>${ef.nombre}</b> (${ef.duracion||''}) ` +
            (ef.atributo?`<span style='color:#2a4d7a;'>[${ef.atributo}${ef.valor?((ef.valor>0?'+':'')+ef.valor):''}]</span>`:'') +
            `<button class='edit-btn'>Editar</button>`+
            `<button class='delete-btn'>Eliminar</button>`+
            `<button class='use-btn'>Usar</button>`;
        div.querySelector('.edit-btn').onclick = () => {
            document.getElementById('efecto-nombre').value = ef.nombre;
            document.getElementById('efecto-duracion').value = ef.duracion||'';
            document.getElementById('efecto-atributo').value = ef.atributo||'';
            document.getElementById('efecto-valor').value = ef.valor||'';
        };
        div.querySelector('.delete-btn').onclick = () => {
            lista.splice(idx,1); renderEfectosModal(); renderBuffsDebuffs(); renderEffects();
        };
        div.querySelector('.use-btn').onclick = () => {
            if(ef.atributo && ef.valor) {
                if(['fuerza','inteligencia','agilidad','metabolismo','am'].includes(ef.atributo)) {
                    character.attributes[ef.atributo] += ef.valor;
                    updateModifiers();
                } else if(['vida','armadura','mistyculas'].includes(ef.atributo)) {
                    character.stats[ef.atributo] += ef.valor;
                }
                renderCharacter();
            }
            ef.duracion = ef.duracion ? ef.duracion-1 : 0;
            if(ef.duracion<=0) { lista.splice(idx,1); }
            renderEfectosModal(); renderBuffsDebuffs(); renderEffects();
        };
        cont.appendChild(div);
    });
}
function addOrUpdateEfectoModal() {
    const tipo = document.getElementById('efecto-tipo').value;
    const nombre = document.getElementById('efecto-nombre').value.trim();
    const duracion = parseInt(document.getElementById('efecto-duracion').value)||null;
    const atributo = document.getElementById('efecto-atributo').value;
    const valor = parseInt(document.getElementById('efecto-valor').value)||null;
    if(!nombre) return;
    let lista = [];
    if(tipo==='buffo') lista = character.combat.buffs;
    else if(tipo==='debuffo') lista = character.combat.debuffs;
    else lista = character.combat.efectos;
    // Si ya existe, actualiza
    let found = lista.find(e=>e.nombre===nombre);
    if(found) {
        found.duracion = duracion;
        found.atributo = atributo;
        found.valor = valor;
    } else {
        lista.push({nombre, duracion, atributo, valor});
    }
    renderEfectosModal(); renderBuffsDebuffs(); renderEffects();
}

function updateLevel() {
    // Tabla de XP personalizada
    const expTable = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];
    let lvl = 1;
    for (let i = 1; i < expTable.length; i++) {
        if (character.stats.xpComun >= expTable[i]) lvl = i + 1;
    }
    character.stats.nivel = lvl;
}

function renderCharacter() {
    // Datos básicos
    document.getElementById('char-name').value = character.name;
    document.getElementById('char-race').value = character.race;
    document.getElementById('char-languages').value = character.languages;
    document.getElementById('char-personality').value = character.personality;
    document.getElementById('char-image').src = character.image || 'https://placehold.co/120x120';

    // Atributos y modificadores
    for (let key in character.attributes) {
        document.getElementById('attr-' + key).value = character.attributes[key];
        document.getElementById('mod-' + key).innerText = (character.modifiers[key] >= 0 ? '+' : '') + character.modifiers[key];
    }

    // Estadísticas
    document.getElementById('vida-actual').value = character.stats.vida;
    document.getElementById('vida-max').innerText = character.stats.vidaMax;
    document.getElementById('armadura').value = character.stats.armadura;
    document.getElementById('mistyculas-actual').value = character.stats.mistyculas;
    document.getElementById('mistyculas-max').innerText = character.stats.mistyculasMax;
    document.getElementById('xp-comun').value = character.stats.xpComun;
    document.getElementById('nivel').innerText = character.stats.nivel;
    document.getElementById('grupo-accion').value = character.combat.grupoAccion;

    // Buffos, debuffos y efectos
    renderEffects();
    renderBuffsDebuffs();
    renderInventory();
    renderEquipamiento();
}
// Redefinir renderCharacter inmediatamente después de su declaración
{
  const origRenderCharacter = renderCharacter;
  renderCharacter = function() {
    origRenderCharacter();
    afterRenderGeneralUI();
  }
}

function renderEffects() {
    const cont = document.getElementById('efectos-lista');
    cont.innerHTML = '';
    character.combat.efectos.forEach((ef, idx) => {
        const el = document.createElement('span');
        el.className = 'effect';
        el.innerText = ef.nombre + (ef.duracion ? ` (${ef.duracion})` : '');
        cont.appendChild(el);
    });
}

function renderBuffsDebuffs() {
    const buffs = document.getElementById('buffs-lista');
    const debuffs = document.getElementById('debuffs-lista');
    buffs.innerHTML = '';
    debuffs.innerHTML = '';
    character.combat.buffs.forEach((b, idx) => {
        const el = document.createElement('span');
        el.className = 'buff';
        el.innerText = b.nombre + (b.duracion ? ` (${b.duracion})` : '');
        buffs.appendChild(el);
    });
    character.combat.debuffs.forEach((d, idx) => {
        const el = document.createElement('span');
        el.className = 'debuff';
        el.innerText = d.nombre + (d.duracion ? ` (${d.duracion})` : '');
        debuffs.appendChild(el);
    });
}

function renderInventory() {
    // Objetos, habilidades, tecnicas, hechizos, mascotas
    ['objetos','habilidades','tecnicas','hechizos'].forEach(tipo => {
        const ul = document.getElementById(tipo+'-lista');
        if (!ul) return;
        ul.innerHTML = '';
        character.inventory[tipo].forEach((item, idx) => {
            const li = document.createElement('li');
            li.innerText = item.nombre || item;
            const btnEdit = document.createElement('button');
            btnEdit.innerText = 'Editar';
            btnEdit.onclick = () => openModalItem(tipo, idx);
            const btnDel = document.createElement('button');
            btnDel.innerText = 'Eliminar';
            btnDel.onclick = () => { character.inventory[tipo].splice(idx,1); renderInventory(); };
            li.appendChild(btnEdit);
            li.appendChild(btnDel);
            // Botón USAR solo para habilidades, tecnicas, hechizos
            if(['habilidades','tecnicas','hechizos'].includes(tipo)) {
                const btnUse = document.createElement('button');
                btnUse.innerText = 'Usar';
                btnUse.onclick = () => mostrarModalUsoItem(tipo, item);
                li.appendChild(btnUse);
            }
            ul.appendChild(li);
        });
    });
// Modal para mostrar el uso de habilidades, tecnicas y hechizos
function mostrarModalUsoItem(tipo, item) {
    let modal = document.getElementById('modal-uso-item');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-uso-item';
        modal.className = 'modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-content modal-content-visual modal-content-wide" style="max-width:400px;">
                <span class="close close-visual" id="close-modal-uso-item">&times;</span>
                <h3 class="modal-title-visual" id="modal-uso-item-title"></h3>
                <div id="modal-uso-item-body" style="margin:18px 0;"></div>
                <button id="cerrar-uso-item-btn" class="modal-save-btn">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
        // Cerrar modal
        modal.querySelector('#close-modal-uso-item').onclick = () => { modal.style.display = 'none'; };
        modal.querySelector('#cerrar-uso-item-btn').onclick = () => { modal.style.display = 'none'; };
    }
    // Título
    modal.querySelector('#modal-uso-item-title').innerText = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${item.nombre || ''}`;
    // Contenido
    let html = '';
    if(item.descripcion) html += `<div><b>Descripción:</b> ${item.descripcion}</div>`;
    if(item.rareza) html += `<div><b>Rareza:</b> ${item.rareza}</div>`;
    if(item.costoAccion) html += `<div><b>Costo de acciones:</b> ${item.costoAccion}</div>`;
    if(item.costoMistyculas) html += `<div><b>Costo de mistyculas:</b> ${item.costoMistyculas}</div>`;
    if(item.duracion) html += `<div><b>Duración:</b> ${item.duracion}</div>`;
    if(item.efectos) html += `<div><b>Efectos:</b> ${item.efectos}</div>`;
    if(Array.isArray(item.formulas) && item.formulas.length > 0) {
        html += `<div><b>Fórmulas:</b><ul style='margin:0 0 0 18px;'>`;
        item.formulas.forEach(f => {
            let resultado = '';
            try {
                resultado = evaluarFormula(f, item);
            } catch(e) {
                resultado = '<span style="color:red;">Error</span>';
            }
            html += `<li>${f} <span style='color:#2a4d7a;font-weight:bold;'>&rarr; ${resultado}</span></li>`;
        });
        html += `</ul></div>`;
    }
    modal.querySelector('#modal-uso-item-body').innerHTML = html || '<em>Sin detalles.</em>';
    modal.style.display = 'flex';
}

// Evalúa una fórmula tipo "1d6+mod_fuerza+3" usando los atributos del personaje
function evaluarFormula(formula, item) {
    // Reemplaza mod_xxx, Mod.Fuerza, Mod.Int, etc. por el modificador correspondiente
    let f = formula;
    // Definiciones para reconocimiento flexible (con y sin espacios, puntos, etc.)
    const attrMap = {
        fuerza: 'fuerza',
        inteligencia: 'inteligencia',
        int: 'inteligencia',
        agilidad: 'agilidad',
        agi: 'agilidad',
        metabolismo: 'metabolismo',
        met: 'metabolismo',
        am: 'am',
        'a.m': 'am',
        'a m': 'am',
        'a_m': 'am',
        'a.m.': 'am',
    };
    const statMap = {
        mistyculas: () => character.stats.mistyculas,
        armadura: () => character.stats.armadura,
        vidabase: () => character.base.vida,
        vidaactual: () => character.stats.vida,
        mistyculasmax: () => character.stats.mistyculasMax,
        vidamax: () => character.stats.vidaMax,
        nivel: () => character.stats.nivel,
        xpcomun: () => character.stats.xpComun,
    };
    // 1. Reemplazo de modificadores (modfuerza, mod_fuerza, mod.fuerza, mod fuerza, etc.)
    f = f.replace(/mod[ ._]?([a-zA-Z]+)(?=\b|[^a-zA-Z]|$)/gi, (m, attr) => {
        attr = attr.toLowerCase().replace(/\s|\.|_/g, '');
        let key = attrMap[attr] || attr;
        let val = 0;
        if(character.modifiers && typeof character.modifiers[key] !== 'undefined')
            val = character.modifiers[key];
        else if(character.attributes && typeof character.attributes[key] !== 'undefined')
            val = Math.floor((character.attributes[key]-10)/2);
        return val;
    });
    // 2. Reemplazo de atributos (fuerza, inteligencia, agilidad, metabolismo, am, etc.)
    f = f.replace(/(fuerza|inteligencia|int|agilidad|agi|metabolismo|met|a[ ._]?m)/gi, (m) => {
        let clean = m.toLowerCase().replace(/\s|\.|_/g, '');
        let key = attrMap[clean] || clean;
        let val = 0;
        if(character.attributes && typeof character.attributes[key] !== 'undefined')
            val = character.attributes[key];
        return val;
    });
    // 3. Reemplazo de stats (mistyculas, armadura, vidabase, vidaactual, etc.)
    f = f.replace(/(mistyculasmax|mistyculas|armadura|vidabase|vidaactual|vidamax|nivel|xpcomun)/gi, (m) => {
        let clean = m.toLowerCase().replace(/\s/g, '');
        if(statMap[clean]) return statMap[clean]();
        return m;
    });
    // 4. Reemplazo de "Vida Base" y "Vida Actual" con espacios (para compatibilidad)
    f = f.replace(/vida base/gi, character.base.vida);
    f = f.replace(/vida actual/gi, character.stats.vida);
    // 5. Reemplazo de "Mistyculas Max" y "Vida Max" con espacios
    f = f.replace(/mistyculas max/gi, character.stats.mistyculasMax);
    f = f.replace(/vida max/gi, character.stats.vidaMax);
    // Permite "XdY" (ej: 2d6+3)
    // Ejecuta todas las tiradas de dados
    f = f.replace(/(\d+)d(\d+)/gi, (m, n, d) => {
        n = parseInt(n); d = parseInt(d);
        let total = 0, rolls = [];
        for(let i=0;i<n;i++) {
            let roll = Math.floor(Math.random()*d)+1;
            rolls.push(roll);
            total += roll;
        }
        return total + (n>1 ? ` [${rolls.join(", ")}]` : '');
    });
    // Evalúa la expresión matemática final (solo números y + - * / paréntesis)
    try {
        // Solo permite números, espacios, + - * / ( ) y corchetes
        if(/^[\d\s+\-*/().\[\],]+$/.test(f)) {
            // Si hay corchetes (rolls), los ignora en el eval
            let fEval = f.replace(/\[.*?\]/g, '');
            // eslint-disable-next-line no-eval
            let res = eval(fEval);
            // Si hay rolls, los muestra
            let rolls = f.match(/\[.*?\]/g);
            if(rolls) return res + ' ' + rolls.join(' ');
            return res;
        } else {
            return f;
        }
    } catch(e) {
        return '<span style="color:red;">Error</span>';
    }
}

    // Render mascotas con mini ficha visual
    const ulMascotas = document.getElementById('mascotas-lista');
    if (ulMascotas) {
        ulMascotas.innerHTML = '';
        character.inventory.mascotas.forEach((mascota, idx) => {
            const li = document.createElement('li');
            li.className = 'mini-sheet-pet mini-sheet-pet-list';
            li.innerHTML = `
                <div class="mini-sheet-pet-header">
                    <div class="mini-sheet-pet-imgbox">
                        <img src="${mascota.imagen || 'https://placehold.co/100x100'}" alt="Imagen Mascota" class="mini-sheet-pet-img">
                    </div>
                    <div class="mini-sheet-pet-maininfo">
                        <div><strong>${mascota.nombre || 'Mascota'}</strong> <span style="font-size:0.9em;color:#888;">(${mascota.tipo||''})</span></div>
                        <div style="font-size:0.95em;">Nivel: ${mascota.nivel||1} | Rareza: ${mascota.rareza||''}</div>
                    </div>
                </div>
                <div class="mini-sheet-pet-attrstats">
                    <div class="mini-sheet-pet-attrs">
                        <span>Fuerza: ${mascota.fuerza||0} <span class="mini-mod">[${typeof mascota.mod_fuerza !== 'undefined' ? (mascota.mod_fuerza>=0?'+':'')+mascota.mod_fuerza : (mascota.fuerza?((Math.floor((mascota.fuerza-10)/2)>=0?'+':'')+Math.floor((mascota.fuerza-10)/2)):'0')}]</span></span>
                        <span>Int: ${mascota.inteligencia||0} <span class="mini-mod">[${typeof mascota.mod_inteligencia !== 'undefined' ? (mascota.mod_inteligencia>=0?'+':'')+mascota.mod_inteligencia : (mascota.inteligencia?((Math.floor((mascota.inteligencia-10)/2)>=0?'+':'')+Math.floor((mascota.inteligencia-10)/2)):'0')}]</span></span>
                        <span>Agi: ${mascota.agilidad||0} <span class="mini-mod">[${typeof mascota.mod_agilidad !== 'undefined' ? (mascota.mod_agilidad>=0?'+':'')+mascota.mod_agilidad : (mascota.agilidad?((Math.floor((mascota.agilidad-10)/2)>=0?'+':'')+Math.floor((mascota.agilidad-10)/2)):'0')}]</span></span>
                        <span>Met: ${mascota.metabolismo||0} <span class="mini-mod">[${typeof mascota.mod_metabolismo !== 'undefined' ? (mascota.mod_metabolismo>=0?'+':'')+mascota.mod_metabolismo : (mascota.metabolismo?((Math.floor((mascota.metabolismo-10)/2)>=0?'+':'')+Math.floor((mascota.metabolismo-10)/2)):'0')}]</span></span>
                        <span>A.M.: ${mascota.am||0} <span class="mini-mod">[${typeof mascota.mod_am !== 'undefined' ? (mascota.mod_am>=0?'+':'')+mascota.mod_am : (mascota.am?((Math.floor((mascota.am-10)/2)>=0?'+':'')+Math.floor((mascota.am-10)/2)):'0')}]</span></span>
                    </div>
                    <div class="mini-sheet-pet-stats">
                        <span>Vida: ${mascota.vida||0}</span>
                        <span>Armadura: ${mascota.armadura||0}</span>
                        <span>Mistyculas: ${mascota.mistyculas||0}</span>
                    </div>
                </div>
                <div class="mini-sheet-pet-habs" style="font-size:0.95em;margin-top:2px;"><em>${mascota.habilidades||''}</em></div>
                <div class="mini-sheet-pet-actions">
                    <button class="mini-sheet-pet-edit">Editar</button>
                    <button class="mini-sheet-pet-del">Eliminar</button>
                </div>
            `;
            // Editar
            li.querySelector('.mini-sheet-pet-edit').onclick = () => openMascotaModal(idx);
            // Eliminar
            li.querySelector('.mini-sheet-pet-del').onclick = () => { character.inventory.mascotas.splice(idx,1); renderInventory(); };
            ulMascotas.appendChild(li);
        });
    }
// Redefinir renderInventory inmediatamente después de su declaración
{
  const origRenderInventory = renderInventory;
  renderInventory = function() {
    origRenderInventory();
    afterRenderGeneralUI();
  }
}
}


// --- EQUIPAMIENTO Y BOLSILLOS ---
// Renderiza el apartado de equipamiento y bolsillos
function renderEquipamiento() {
    const cont = document.getElementById('equipamiento-lista');
    if (!cont) return;
    cont.innerHTML = '';
    // Título y controles
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = `<h3 style='margin-bottom:8px;'>Equipamientos</h3>`;
    cont.appendChild(titleDiv);
    // Botón para crear un nuevo bolsillo (abre modal)
    const controlsDiv = document.createElement('div');
    controlsDiv.style = 'margin-bottom:12px;';
    controlsDiv.innerHTML = `
        <button id='crear-bolsillo-btn'>Crear bolsillo</button>
    `;
    cont.appendChild(controlsDiv);
    // Render bolsillos (slots)
    if (!Array.isArray(character.inventory.equipamiento)) character.inventory.equipamiento = [];
    for (let i = 0; i < character.inventory.equipamiento.length; i++) {
        let slot = character.inventory.equipamiento[i];
        if (!slot || typeof slot !== 'object' || Array.isArray(slot)) {
            slot = {_nombreBolsillo: `Bolsillo ${i+1}`, clasificacion: 'accesorios'};
            character.inventory.equipamiento[i] = slot;
        }
        const div = document.createElement('div');
        div.className = 'equip-slot';
        div.style = 'margin-bottom:8px;padding:6px;border:1px solid #bbb;border-radius:6px;min-height:32px;background:#f8f8fa;display:flex;align-items:center;gap:10px;';
        // Nombre y clasificación
        let nombreBolsillo = slot._nombreBolsillo || `Bolsillo ${i+1}`;
        let clasif = slot.clasificacion || 'accesorios';
        div.innerHTML = `<span class='nombre-bolsillo-label' style='font-weight:bold;margin-right:8px;'>${nombreBolsillo}</span>`;
        div.innerHTML += `<span class='clasif-bolsillo-label' style='font-size:0.95em;color:#555;margin-right:8px;'>[${clasif.charAt(0).toUpperCase() + clasif.slice(1)}]</span>`;
        // Botón editar
        div.innerHTML += `<button class='editar-bolsillo-btn' data-slot='${i}' style='margin-right:8px;'>Editar</button>`;
        // Botón eliminar bolsillo
        div.innerHTML += `<button class='eliminar-bolsillo-btn' data-slot='${i}' style='margin-right:8px;color:#b00;'>Eliminar</button>`;
        if (slot.equipado) {
            div.innerHTML += `${slot.equipado.nombre || slot.equipado} <button class='unequip-btn' data-slot='${i}'>Quitar</button>`;
            if (slot.equipado.bono) {
                div.innerHTML += `<div style='font-size:0.95em;color:#2a4d7a;'>Bonificación: ${slot.equipado.bono}</div>`;
            }
        } else {
            div.innerHTML += `<span style='color:#888;'>Vacío</span> <button class='equip-btn' data-slot='${i}'>Equipar</button>`;
        }
        cont.appendChild(div);
    }
    // Listeners para equipar/quitar
    cont.querySelectorAll('.equip-btn').forEach(btn => {
        btn.onclick = function() {
            openEquiparModal(parseInt(btn.dataset.slot));
        };
    });
    cont.querySelectorAll('.unequip-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(btn.dataset.slot);
            if (character.inventory.equipamiento[idx]) {
                character.inventory.equipamiento[idx].equipado = null;
            }
            aplicarBonosEquipamiento();
            renderEquipamiento();
            renderCharacter();
        };
    });
    // Listener para editar bolsillo (abre modal)
    cont.querySelectorAll('.editar-bolsillo-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(btn.dataset.slot);
            openEditarBolsilloModal(idx);
        };
    });
    // Listener para eliminar bolsillo
    cont.querySelectorAll('.eliminar-bolsillo-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(btn.dataset.slot);
            character.inventory.equipamiento.splice(idx, 1);
            renderEquipamiento();
            renderCharacter();
        };
    });
    // Listener para crear bolsillo (abre modal)
    document.getElementById('crear-bolsillo-btn').onclick = function() {
        openEditarBolsilloModal();
    };

    // Modal de edición/creación de bolsillo
    if (!document.getElementById('modal-bolsillo')) {
        const modal = document.createElement('div');
        modal.id = 'modal-bolsillo';
        modal.className = 'modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-content" style="max-width:340px;">
                <span class="close" id="close-modal-bolsillo">&times;</span>
                <h3 id="modal-bolsillo-title">Crear/Editar bolsillo</h3>
                <label>Nombre:<br><input id="modal-bolsillo-nombre" type="text" style="width:90%;margin-bottom:10px;"></label><br>
                <label>Clasificación:<br>
                    <select id="modal-bolsillo-clasif" style="width:90%;margin-bottom:10px;">
                        <option value="cabeza">Cabeza</option>
                        <option value="cuerpo">Cuerpo</option>
                        <option value="extremidades">Extremidades</option>
                        <option value="accesorios">Accesorios</option>
                    </select>
                </label><br>
                <button id="guardar-bolsillo-btn">Guardar</button>
            </div>
        `;
        document.body.appendChild(modal);
        // Cerrar modal
        modal.querySelector('#close-modal-bolsillo').onclick = () => { modal.style.display = 'none'; };
    }
    window.openEditarBolsilloModal = function(idx) {
        const modal = document.getElementById('modal-bolsillo');
        const inputNombre = document.getElementById('modal-bolsillo-nombre');
        const selectClasif = document.getElementById('modal-bolsillo-clasif');
        const title = document.getElementById('modal-bolsillo-title');
        if (typeof idx === 'number') {
            // Editar
            const slot = character.inventory.equipamiento[idx];
            inputNombre.value = slot._nombreBolsillo || '';
            selectClasif.value = slot.clasificacion || 'accesorios';
            title.innerText = 'Editar bolsillo';
        } else {
            // Crear
            inputNombre.value = '';
            selectClasif.value = 'accesorios';
            title.innerText = 'Crear bolsillo';
        }
        modal.style.display = 'flex';
        // Guardar
        const guardarBtn = document.getElementById('guardar-bolsillo-btn');
        guardarBtn.onclick = function() {
            const nombre = inputNombre.value.trim() || `Bolsillo ${character.inventory.equipamiento.length + 1}`;
            const clasif = selectClasif.value;
            if (typeof idx === 'number') {
                // Editar
                character.inventory.equipamiento[idx]._nombreBolsillo = nombre;
                character.inventory.equipamiento[idx].clasificacion = clasif;
            } else {
                // Crear
                character.inventory.equipamiento.push({_nombreBolsillo: nombre, clasificacion: clasif});
            }
            modal.style.display = 'none';
            renderEquipamiento();
            renderCharacter();
        };
    };
}

// Modal para elegir objeto a equipar
function openEquiparModal(slotIdx) {
    let modal = document.getElementById('modal-equipar');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-equipar';
        modal.className = 'modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-content" style="max-width:340px;">
                <span class="close" id="close-modal-equipar">&times;</span>
                <h3>Equipar objeto</h3>
                <div id="equipar-obj-list"></div>
                <button id="cancelar-equipar-btn">Cancelar</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#close-modal-equipar').onclick = () => { modal.style.display = 'none'; };
        modal.querySelector('#cancelar-equipar-btn').onclick = () => { modal.style.display = 'none'; };
    }
    // Lista de objetos no equipados
    const lista = document.getElementById('equipar-obj-list');
    lista.innerHTML = '';
    character.inventory.objetos.forEach((obj, idx) => {
        // No permitir equipar si ya está equipado en otro bolsillo
        if (character.inventory.equipamiento.some(e => e && e.equipado && e.equipado.nombre === obj.nombre)) return;
        const div = document.createElement('div');
        div.className = 'equipar-obj-item';
        div.style = 'margin-bottom:6px;';
        div.innerHTML = `${obj.nombre || obj} <button class='equipar-btn' data-idx='${idx}'>Equipar</button>`;
        lista.appendChild(div);
    });
    lista.querySelectorAll('.equipar-btn').forEach(btn => {
        btn.onclick = function() {
            const objIdx = parseInt(btn.dataset.idx);
            let slot = character.inventory.equipamiento[slotIdx];
            if (!slot || typeof slot !== 'object') {
                slot = {};
                character.inventory.equipamiento[slotIdx] = slot;
            }
            slot.equipado = character.inventory.objetos[objIdx];
            aplicarBonosEquipamiento();
            renderEquipamiento();
            renderCharacter();
            modal.style.display = 'none';
        };
    });
    modal.style.display = 'flex';
}

// Aplica los bonus de equipamiento a los stats y atributos
function aplicarBonosEquipamiento() {
    // Reset a valores base
    updateModifiers();
    updateStats();
    // Suma los bonus de cada objeto equipado
    if (!Array.isArray(character.inventory.equipamiento)) return;
    character.inventory.equipamiento.forEach(slot => {
        if (!slot || !slot.equipado || !slot.equipado.bono) return;
        let bonos = slot.equipado.bono.split(/[,;]/).map(b=>b.trim()).filter(Boolean);
        bonos.forEach(b => {
            // Formato: stat+N, stat-N, atributo+N, etc. Ej: fuerza+2, vida+5
            let m = b.match(/^([a-zA-Záéíóúñ._ ]+)([+\-]\d+)$/);
            if (m) {
                let nombre = m[1].toLowerCase().replace(/\s|\.|_/g, '');
                let valor = parseInt(m[2]);
                // Buscar en atributos
                if (character.attributes.hasOwnProperty(nombre)) {
                    character.attributes[nombre] += valor;
                } else if (character.stats.hasOwnProperty(nombre)) {
                    character.stats[nombre] += valor;
                } else if (nombre === 'vida') {
                    character.stats.vida += valor;
                } else if (nombre === 'armadura') {
                    character.stats.armadura += valor;
                } else if (nombre === 'mistyculas') {
                    character.stats.mistyculas += valor;
                }
            }
        });
    });
    // Recalcular modificadores y stats después de aplicar bonus
    updateModifiers();
    updateStats();
}

function handleInputChange(e) {
    const id = e.target.id;
    if (id.startsWith('char-')) {
        const key = id.replace('char-','');
        character[key] = e.target.value;
    } else if (id.startsWith('attr-')) {
        const key = id.replace('attr-','');
        character.attributes[key] = parseInt(e.target.value)||0;
        updateModifiers();
        updateStats();
    } else if (id === 'vida-actual') {
        character.stats.vida = parseInt(e.target.value)||0;
    } else if (id === 'armadura') {
        character.stats.armadura = parseInt(e.target.value)||0;
    } else if (id === 'mistyculas-actual') {
        character.stats.mistyculas = parseInt(e.target.value)||0;
    } else if (id === 'xp-comun') {
        character.stats.xpComun = parseInt(e.target.value)||0;
        updateLevel();
    } else if (id === 'grupo-accion') {
        character.combat.grupoAccion = e.target.value;
    }
    renderCharacter();
}

function addXP(amount) {
    character.stats.xpComun += amount;
    updateLevel();
    renderCharacter();
}

function applyDamage(amount) {
    character.stats.vida = Math.max(0, character.stats.vida - amount);
    renderCharacter();
}

function heal(amount) {
    character.stats.vida = Math.min(character.stats.vidaMax, character.stats.vida + amount);
    renderCharacter();
}

function regenMistyculas(amount) {
    character.stats.mistyculas = Math.min(character.stats.mistyculasMax, character.stats.mistyculas + amount);
    renderCharacter();
}

function exportCharacter() {
    const data = JSON.stringify(character, null, 2);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personaje.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importCharacter(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        try {
            character = JSON.parse(ev.target.result);
            updateModifiers();
            updateStats();
            updateLevel();
            renderCharacter();
        } catch (err) {
            alert('Error al importar personaje.');
        }
    };
    reader.readAsText(file);
}

function addItem(tipo) {
    openModalItem(tipo);
}

// --- MODAL CREACIÓN/EDICIÓN ---
const itemFields = {
    objetos: [
        {label:'Nombre', id:'nombre', type:'text'},
        {label:'Tipo', id:'tipo', type:'text'},
        {label:'Descripción', id:'descripcion', type:'textarea'},
        {label:'Bonificación', id:'bono', type:'text'}
    ],
    habilidades: [
        {label:'Nombre', id:'nombre', type:'text'},
        {label:'Descripción', id:'descripcion', type:'textarea'},
        {label:'Costo de acciones', id:'costoAccion', type:'number'},
        {label:'Costo de mistyculas', id:'costoMistyculas', type:'number'},
        {label:'Duración', id:'duracion', type:'number'},
        {label:'Efectos', id:'efectos', type:'text'}
    ],
    tecnicas: [
        {label:'Nombre', id:'nombre', type:'text'},
        {label:'Tipo', id:'tipo', type:'text'},
        {label:'Descripción', id:'descripcion', type:'textarea'},
        {label:'Costo de acciones', id:'costoAccion', type:'number'},
        {label:'Costo de mistyculas', id:'costoMistyculas', type:'number'},
        {label:'Duración', id:'duracion', type:'number'},
        {label:'Efectos', id:'efectos', type:'text'}
    ],
    hechizos: [
        {label:'Nombre', id:'nombre', type:'text'},
        {label:'Tipo', id:'tipo', type:'text'},
        {label:'Descripción', id:'descripcion', type:'textarea'},
        {label:'Costo de mistyculas', id:'costoMistyculas', type:'number'},
        {label:'Duración', id:'duracion', type:'number'},
        {label:'Efectos', id:'efectos', type:'text'}
    ],
    mascotas: [
        {label:'Nombre', id:'nombre', type:'text'},
        {label:'Tipo', id:'tipo', type:'text'},
        {label:'Nivel', id:'nivel', type:'number'},
        {label:'Descripción', id:'descripcion', type:'textarea'},
        {label:'Vida', id:'vida', type:'number'},
        {label:'Armadura', id:'armadura', type:'number'},
        {label:'Atributos', id:'atributos', type:'text'},
        {label:'Habilidad especial', id:'habilidad', type:'text'}
    ]
};

let modalItemTipo = null;
let modalItemIdx = null;

function openModalItem(tipo, idx) {
    modalItemTipo = tipo;
    modalItemIdx = idx;
    document.getElementById('modal-item-title').innerText = (idx !== undefined ? 'Editar ' : 'Crear ') + tipo.charAt(0).toUpperCase() + tipo.slice(1);
    const fields = itemFields[tipo];
    const cont = document.getElementById('modal-item-fields');
    cont.innerHTML = '';
    let values = idx !== undefined ? character.inventory[tipo][idx] : {};
    fields.forEach(f => {
        if(f.id === 'rareza') return; // omitimos rareza, ya está en el HTML
        let input;
        if(f.type==='textarea') {
            input = document.createElement('textarea');
        } else {
            input = document.createElement('input');
            input.type = f.type;
        }
        input.id = 'modal-item-'+f.id;
        input.value = values[f.id] || '';
        const label = document.createElement('label');
        label.innerText = f.label+':';
        label.appendChild(input);
        cont.appendChild(label);
    });
    // Rareza (autocompletado)
    const rarezaInput = document.getElementById('modal-item-rareza');
    if(rarezaInput) rarezaInput.value = values.rareza || '';
    // Mostrar builder de fórmulas solo para habilidades, tecnicas, hechizos
    const builder = document.getElementById('formula-builder');
    if(['habilidades','tecnicas','hechizos'].includes(tipo)) {
        builder.style.display = '';
        renderFormulaList(values.formulas||[]);
        document.getElementById('formula-input').value = '';
    } else {
        builder.style.display = 'none';
    }
    document.getElementById('modal-item').style.display = 'flex';
    builder.dataset.tipo = tipo;
}

// --- FORMULA BUILDER ---
let currentFormulas = [];
function renderFormulaList(list) {
    currentFormulas = Array.isArray(list) ? list.slice() : [];
    const cont = document.getElementById('formula-list');
    cont.innerHTML = '';
    currentFormulas.forEach((f,i) => {
        const div = document.createElement('div');
        div.className = 'formula-item';
        div.innerText = f;
        const btn = document.createElement('button');
        btn.className = 'delete-formula-btn';
        btn.innerText = 'Eliminar';
        btn.onclick = () => { currentFormulas.splice(i,1); renderFormulaList(currentFormulas); };
        div.appendChild(btn);
        cont.appendChild(div);
    });
}
function addFormula() {
    const val = document.getElementById('formula-input').value.trim();
    if(val) {
        currentFormulas.push(val);
        renderFormulaList(currentFormulas);
        document.getElementById('formula-input').value = '';
    }
}
function insertFormulaText(e) {
    const val = e.target.dataset.insert;
    const input = document.getElementById('formula-input');
    if(input && val) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = input.value.slice(0, start) + val + input.value.slice(end);
        input.focus();
        input.selectionStart = input.selectionEnd = start + val.length;
    }
}

function closeModalItem() {
    document.getElementById('modal-item').style.display = 'none';
}

function saveModalItem() {
    const tipo = modalItemTipo;
    const idx = modalItemIdx;
    const fields = itemFields[tipo];
    let obj = {};
    fields.forEach(f => {
        if(f.id === 'rareza') return;
        let val = document.getElementById('modal-item-'+f.id).value;
        if(f.type==='number') val = parseInt(val)||0;
        obj[f.id] = val;
    });
    // Rareza
    const rarezaInput = document.getElementById('modal-item-rareza');
    obj.rareza = rarezaInput ? rarezaInput.value.trim() : '';
    // Guardar formulas si corresponde
    if(['habilidades','tecnicas','hechizos'].includes(tipo)) {
        obj.formulas = currentFormulas.slice();
    }
    if(idx !== undefined) {
        character.inventory[tipo][idx] = obj;
    } else {
        character.inventory[tipo].push(obj);
    }
    closeModalItem();
    renderInventory();
}

// Imagen de personaje
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        character.image = ev.target.result;
        document.getElementById('char-image').src = character.image;
    };
    reader.readAsDataURL(file);
}

// --- MASCOTA: Modificadores en tiempo real y guardado ---
function calcMascotaMods() {
    const attrs = [
        {id: 'fuerza', mod: 'mascota-mod-fuerza'},
        {id: 'inteligencia', mod: 'mascota-mod-inteligencia'},
        {id: 'agilidad', mod: 'mascota-mod-agilidad'},
        {id: 'metabolismo', mod: 'mascota-mod-metabolismo'},
        {id: 'am', mod: 'mascota-mod-am'}
    ];
    attrs.forEach(({id, mod}) => {
        const val = parseInt(document.getElementById('mascota-' + id).value) || 0;
        const modVal = Math.floor((val - 10) / 2);
        document.getElementById(mod).innerText = (modVal >= 0 ? '+' : '') + modVal;
    });
}


// Guardar mascota: solo nombre, tipo, habilidades al crear; todo al editar
document.getElementById('save-mascota-btn').onclick = function() {
    let mascota;
    if(typeof window.editingMascotaIdx === 'number') {
        // Editar: guarda todo
        mascota = {
            imagen: document.getElementById('mascota-img-preview').src,
            nombre: document.getElementById('mascota-nombre').value,
            tipo: document.getElementById('mascota-tipo').value,
            descripcion: document.getElementById('mascota-desc').value,
            fuerza: parseInt(document.getElementById('mascota-fuerza').value)||0,
            inteligencia: parseInt(document.getElementById('mascota-inteligencia').value)||0,
            agilidad: parseInt(document.getElementById('mascota-agilidad').value)||0,
            metabolismo: parseInt(document.getElementById('mascota-metabolismo').value)||0,
            am: parseInt(document.getElementById('mascota-am').value)||0,
            mod_fuerza: Math.floor(((parseInt(document.getElementById('mascota-fuerza').value)||0)-10)/2),
            mod_inteligencia: Math.floor(((parseInt(document.getElementById('mascota-inteligencia').value)||0)-10)/2),
            mod_agilidad: Math.floor(((parseInt(document.getElementById('mascota-agilidad').value)||0)-10)/2),
            mod_metabolismo: Math.floor(((parseInt(document.getElementById('mascota-metabolismo').value)||0)-10)/2),
            mod_am: Math.floor(((parseInt(document.getElementById('mascota-am').value)||0)-10)/2),
            vida: parseInt(document.getElementById('mascota-vida').value)||0,
            armadura: parseInt(document.getElementById('mascota-armadura').value)||0,
            mistyculas: parseInt(document.getElementById('mascota-mistyculas').value)||0,
            habilidades: document.getElementById('mascota-habilidades').value
        };
        character.inventory.mascotas[window.editingMascotaIdx] = mascota;
        window.editingMascotaIdx = undefined;
    } else {
        // Crear: solo nombre, tipo, habilidades
        mascota = {
            imagen: document.getElementById('mascota-img-preview').src,
            nombre: document.getElementById('mascota-nombre').value,
            tipo: document.getElementById('mascota-tipo').value,
            habilidades: document.getElementById('mascota-habilidades').value
        };
        character.inventory.mascotas.push(mascota);
    }
    document.getElementById('modal-mascota').style.display = 'none';
    renderInventory();
    // Oculta campos extra si estaban visibles
    document.getElementById('mascota-editar-extra').style.display = 'none';
};

// Abrir modal de mascota para crear o editar
window.openMascotaModal = function(idx) {
    if(typeof idx === 'number') {
        // Editar: muestra todos los campos
        const m = character.inventory.mascotas[idx];
        if(m) {
            document.getElementById('mascota-img-preview').src = m.imagen || 'https://placehold.co/100x100';
            document.getElementById('mascota-nombre').value = m.nombre || '';
            document.getElementById('mascota-tipo').value = m.tipo || '';
            document.getElementById('mascota-desc').value = m.descripcion || '';
            document.getElementById('mascota-fuerza').value = m.fuerza || 0;
            document.getElementById('mascota-inteligencia').value = m.inteligencia || 0;
            document.getElementById('mascota-agilidad').value = m.agilidad || 0;
            document.getElementById('mascota-metabolismo').value = m.metabolismo || 0;
            document.getElementById('mascota-am').value = m.am || 0;
            document.getElementById('mascota-vida').value = m.vida || 0;
            document.getElementById('mascota-armadura').value = m.armadura || 0;
            document.getElementById('mascota-mistyculas').value = m.mistyculas || 0;
            document.getElementById('mascota-habilidades').value = m.habilidades || '';
            window.editingMascotaIdx = idx;
            document.getElementById('mascota-editar-extra').style.display = '';
        }
        // Siempre elimina el input anterior y crea uno nuevo para evitar duplicados/listeners viejos
        const imgBox = document.querySelector('.mini-sheet-pet-imgbox');
        const oldInput = document.getElementById('mascota-img-upload');
        if (oldInput) oldInput.remove();
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.id = 'mascota-img-upload';
        inputFile.accept = 'image/*';
        inputFile.style = 'font-size:0.95em;max-width:120px;';
        inputFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) {
                document.getElementById('mascota-img-preview').src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
        imgBox.appendChild(inputFile);
        // Añadir texto descriptivo si no existe
        if(!imgBox.querySelector('small')) {
            const small = document.createElement('small');
            small.style = 'font-size:0.9em;color:#666;';
            small.innerText = 'Imagen de la mascota';
            imgBox.appendChild(small);
        }
    } else {
        // Crear: solo nombre, tipo, habilidades
        document.getElementById('mascota-img-preview').src = 'https://placehold.co/100x100';
        document.getElementById('mascota-nombre').value = '';
        document.getElementById('mascota-tipo').value = '';
        document.getElementById('mascota-habilidades').value = '';
        // Oculta campos extra
        document.getElementById('mascota-editar-extra').style.display = 'none';
        window.editingMascotaIdx = undefined;
        // Siempre elimina el input anterior y crea uno nuevo para evitar duplicados/listeners viejos
        const imgBox = document.querySelector('.mini-sheet-pet-imgbox');
        const oldInput = document.getElementById('mascota-img-upload');
        if (oldInput) oldInput.remove();
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.id = 'mascota-img-upload';
        inputFile.accept = 'image/*';
        inputFile.style = 'font-size:0.95em;max-width:120px;';
        inputFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) {
                document.getElementById('mascota-img-preview').src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
        imgBox.appendChild(inputFile);
        if(!imgBox.querySelector('small')) {
            const small = document.createElement('small');
            small.style = 'font-size:0.9em;color:#666;';
            small.innerText = 'Imagen de la mascota';
            imgBox.appendChild(small);
        }
    }
    setTimeout(setupMascotaAttrListeners, 100);
    setTimeout(calcMascotaMods, 120);
    document.getElementById('modal-mascota').style.display = 'flex';
};

// Imagen de mascota en modal
// (El listener se asigna dinámicamente al crear el input en openMascotaModal)

// Asignar eventos a los inputs de atributos de mascota
function setupMascotaAttrListeners() {
    ['fuerza','inteligencia','agilidad','metabolismo','am'].forEach(id => {
        const input = document.getElementById('mascota-' + id);
        if(input) {
            input.addEventListener('input', calcMascotaMods);
        }
    });
}

// Llamar a setupMascotaAttrListeners cuando se abre el modal de mascota
const openMascotaModalOrig = window.openMascotaModal;
window.openMascotaModal = function(idx) {
    if(openMascotaModalOrig) openMascotaModalOrig(idx);
    setTimeout(setupMascotaAttrListeners, 100); // Espera a que los inputs existan
    setTimeout(calcMascotaMods, 120);
}
// Si no existe openMascotaModal, crearlo para compatibilidad
if(!window.openMascotaModal) {
    window.openMascotaModal = function(idx) {
        setTimeout(setupMascotaAttrListeners, 100);
        setTimeout(calcMascotaMods, 120);
    }
}


function assignGeneralButtonListeners() {
    // Modal mascota: cerrar con la X
    const closeMascota = document.getElementById('close-modal-mascota');
    if (closeMascota) closeMascota.onclick = function() {
        document.getElementById('modal-mascota').style.display = 'none';
        document.getElementById('mascota-editar-extra').style.display = 'none';
    };
    document.querySelectorAll('input, textarea').forEach(el => {
        if (!el.dataset.listenerInput) {
            el.addEventListener('input', handleInputChange);
            el.dataset.listenerInput = '1';
        }
    });
    const charImgUpload = document.getElementById('char-image-upload');
    if (charImgUpload && !charImgUpload.dataset.listenerChange) {
        charImgUpload.addEventListener('change', handleImageUpload);
        charImgUpload.dataset.listenerChange = '1';
    }
    const btns = [
        {id:'apply-damage-btn', fn:()=>{const v=parseInt(document.getElementById('input-dano').value)||0;if(v)applyDamage(v);}},
        {id:'heal-btn', fn:()=>{const v=parseInt(document.getElementById('input-curacion').value)||0;if(v)heal(v);}},
        {id:'regen-mistyculas-btn', fn:()=>{const v=parseInt(document.getElementById('input-regen-mistyculas').value)||0;if(v)regenMistyculas(v);}},
        {id:'add-xp-btn', fn:()=>{const v=parseInt(document.getElementById('input-xp').value)||0;if(v)addXP(v);}},
        {id:'export-btn', fn:exportCharacter},
    ];
    btns.forEach(({id,fn})=>{
        const b=document.getElementById(id);
        if(b && !b.dataset.listenerClick){b.onclick=fn;b.dataset.listenerClick='1';}
    });
    const importBtn = document.getElementById('import-btn');
    if(importBtn && !importBtn.dataset.listenerChange){importBtn.onchange=importCharacter;importBtn.dataset.listenerChange='1';}
    ['objetos','habilidades','tecnicas','hechizos','mascotas'].forEach(tipo => {
        const btn = document.getElementById('add-'+tipo+'-btn');
        if(btn && !btn.dataset.listenerClick) { btn.onclick = () => addItem(tipo); btn.dataset.listenerClick = '1'; }
    });
    const closeModalItemBtn = document.getElementById('close-modal-item');
    if(closeModalItemBtn && !closeModalItemBtn.dataset.listenerClick) { closeModalItemBtn.onclick = closeModalItem; closeModalItemBtn.dataset.listenerClick = '1'; }
    const saveModalItemBtn = document.getElementById('save-modal-item-btn');
    if(saveModalItemBtn && !saveModalItemBtn.dataset.listenerClick) { saveModalItemBtn.onclick = saveModalItem; saveModalItemBtn.dataset.listenerClick = '1'; }
    const addFormulaBtn = document.getElementById('add-formula-btn');
    if(addFormulaBtn && !addFormulaBtn.dataset.listenerClick) { addFormulaBtn.onclick = addFormula; addFormulaBtn.dataset.listenerClick = '1'; }
    document.querySelectorAll('.formula-btn').forEach(btn => {
        if (!btn.dataset.listenerClick) { btn.onclick = insertFormulaText; btn.dataset.listenerClick = '1'; }
    });
    // Modal bases
    const editBaseBtn = document.getElementById('edit-base-btn');
    if(editBaseBtn && !editBaseBtn.dataset.listenerClick) { editBaseBtn.onclick = showBaseModal; editBaseBtn.dataset.listenerClick = '1'; }
    const closeBaseModalBtn = document.getElementById('close-base-modal');
    if(closeBaseModalBtn && !closeBaseModalBtn.dataset.listenerClick) { closeBaseModalBtn.onclick = hideBaseModal; closeBaseModalBtn.dataset.listenerClick = '1'; }
    const saveBaseBtn = document.getElementById('save-base-btn');
    if(saveBaseBtn && !saveBaseBtn.dataset.listenerClick) { saveBaseBtn.onclick = saveBaseValues; saveBaseBtn.dataset.listenerClick = '1'; }
    // Modal efectos
    const buffsBtn = document.getElementById('edit-buffs-btn');
    if(buffsBtn && !buffsBtn.dataset.listenerClick) { buffsBtn.onclick = showEfectosModal; buffsBtn.dataset.listenerClick = '1'; }
    const debuffsBtn = document.getElementById('edit-debuffs-btn');
    if(debuffsBtn && !debuffsBtn.dataset.listenerClick) { debuffsBtn.onclick = showEfectosModal; debuffsBtn.dataset.listenerClick = '1'; }
    const efectosBtn = document.getElementById('edit-efectos-btn');
    if(efectosBtn && !efectosBtn.dataset.listenerClick) { efectosBtn.onclick = showEfectosModal; efectosBtn.dataset.listenerClick = '1'; }
    const closeEfectosModalBtn = document.getElementById('close-efectos-modal');
    if(closeEfectosModalBtn && !closeEfectosModalBtn.dataset.listenerClick) { closeEfectosModalBtn.onclick = hideEfectosModal; closeEfectosModalBtn.dataset.listenerClick = '1'; }
    const addEfectoModalBtn = document.getElementById('add-efecto-modal-btn');
    if(addEfectoModalBtn && !addEfectoModalBtn.dataset.listenerClick) { addEfectoModalBtn.onclick = addOrUpdateEfectoModal; addEfectoModalBtn.dataset.listenerClick = '1'; }
    const efectoTipo = document.getElementById('efecto-tipo');
    if(efectoTipo && !efectoTipo.dataset.listenerChange) { efectoTipo.onchange = renderEfectosModal; efectoTipo.dataset.listenerChange = '1'; }
}

window.onload = function() {
    updateModifiers();
    updateStats();
    updateLevel();
    renderCharacter();
    assignGeneralButtonListeners();
};

// Llama a la función tras cada render dinámico relevante
function afterRenderGeneralUI() {
    assignGeneralButtonListeners();
}


// --- Redefinir renderCharacter y renderInventory justo después de su declaración ---
// (Mover este bloque justo después de la declaración de cada función)

// 1. Redefinir renderCharacter
{
  const origRenderCharacter = renderCharacter;
  renderCharacter = function() {
    origRenderCharacter();
    afterRenderGeneralUI();
  }
}

// 2. Redefinir renderInventory
{
  const origRenderInventory = renderInventory;
  renderInventory = function() {
    origRenderInventory();
    afterRenderGeneralUI();
  }
}
