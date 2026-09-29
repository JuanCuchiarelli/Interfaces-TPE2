// ============================================================
// Datos de Mundo Juegos (fuente única para Home y game.html)
//
// Para reemplazar un placeholder por la imagen real:
//   1) guardá el archivo en img/games/  (ej: img/games/slither.jpg)
//   2) completá el campo `image` del juego  (ej: image: "img/games/slither.jpg")
// Mientras `image` sea null se muestra el degradé de color + iniciales.
// ============================================================

const DEFAULT_GAME_ID = "pirates-peg-solitaire";
const FEATURED_GAME_ID = "plants-vs-zombies";

const GAMES = [
  {
    id: "slither",
    title: "Slither",
    category: "Arcade",
    premium: false,
    thumb: "thumb--slither",
    initials: "SL",
    image: "img/games/slither.jpg",
    description:
      "Controlás una serpiente que crece a medida que come los puntos de colores. Esquivá a las demás serpientes: si chocás con una, perdés todo lo que juntaste.",
    howTo: "Mové el mouse para guiar a la serpiente y mantené el clic para acelerar.",
  },
  {
    id: "pizza-now",
    title: "Pizza Now!",
    category: "Simulación",
    premium: true,
    thumb: "thumb--pizza",
    initials: "PN",
    image: "img/games/pizza.webp",
    description:
      "Atendé una pizzería a contrarreloj: armá cada pedido con los ingredientes justos, mandalo al horno y entregalo antes de que tus clientes pierdan la paciencia.",
    howTo: "Hacé clic sobre los ingredientes para armar la pizza y arrastrala hasta el horno.",
  },
  {
    id: "pirates-peg-solitaire",
    title: "Pirates Peg Solitaire",
    homeTitle: "Peg Solitaire Pirates",
    category: "Estrategia",
    premium: false,
    thumb: "thumb--pirates",
    initials: "PS",
    image: "img/games/pegsolitaire.jpg",
    description:
      "Pirates PS te pone al mando de una expedición en busca del mayor tesoro de los siete mares. En un tablero en forma de cruz, cada casilla esconde una moneda de oro: tu misión es saltar entre ellas para hacerlas desaparecer, hasta quedarte con la menor cantidad posible. Cuanto más vacío quede el tablero, más cerca estás de reclamar el tesoro pirata.",
    howTo:
      "Hacé clic izquierdo sobre una moneda y arrastrala sobre otra vecina, en línea recta, hacia un espacio vacío para eliminarla. Repetí hasta quedarte con una sola moneda, idealmente en el centro.",
    // Imágenes de la galería. Cuando tengas los exports de Figma, completá `src`.
    gallery: [
      { cls: "gallery__thumb--banner", caption: "Portada de Peg Solitaire Pirates", src: "img/games/pegsolitaire.jpg" },
      { cls: "gallery__thumb--board-full", caption: "Tablero inicial con todas las monedas", src: "img/games/pegsolitaire1.jpg" },
      { cls: "gallery__thumb--board-mid", caption: "Partida avanzada", src: "img/games/pegsolitaire2.jpg" },
    ],
  },
  {
    id: "cake-cat",
    title: "Cake Cat",
    category: "Puzzle",
    premium: false,
    thumb: "thumb--cakecat",
    initials: "CC",
    image: "img/games/cat.png",
    description:
      "Un gato goloso necesita tu ayuda para armar tortas cada vez más altas. Combiná los pisos con cuidado para no perder ningún ingrediente.",
    howTo: "Arrastrá cada piso de la torta hasta su lugar y soltalo con el clic.",
  },
  {
    id: "sudoku",
    title: "Sudoku",
    category: "Puzzle",
    premium: false,
    thumb: "thumb--sudoku",
    initials: "#",
    image: "img/games/sudoku.webp",
    description:
      "El clásico de lógica numérica: completá la grilla de 9x9 sin repetir números en filas, columnas ni bloques.",
    howTo: "Seleccioná una casilla y elegí un número con el teclado o con el mouse.",
  },
  {
    id: "fruit-match",
    title: "Fruit Match",
    category: "Puzzle",
    premium: true,
    thumb: "thumb--fruit",
    initials: "FM",
    image: "img/games/fruit.webp",
    description:
      "Combiná tres o más frutas iguales para hacerlas explotar y cumplí el objetivo de cada nivel antes de quedarte sin movimientos.",
    howTo: "Hacé clic en una fruta y luego en una vecina para intercambiarlas de lugar.",
  },
  {
    id: "poker",
    title: "Poker",
    category: "Cartas",
    premium: false,
    thumb: "thumb--poker",
    initials: "♠",
    image: "img/games/poker.jpg",
    description:
      "Texas Hold'em contra otros jugadores: armá la mejor mano de cinco cartas y usá el farol para quedarte con el pozo.",
    howTo: "Elegí entre pasar, igualar o subir la apuesta con los botones de la mesa.",
  },
  {
    id: "ajedrez",
    title: "Ajedrez",
    category: "Estrategia",
    premium: false,
    thumb: "thumb--chess",
    initials: "♞",
    image: "img/games/ajedrez.jpg",
    description:
      "El juego de estrategia por excelencia: planificá tus jugadas, protegé a tu rey y dale jaque mate al rival.",
    howTo: "Hacé clic en una pieza y luego en la casilla a la que querés moverla.",
  },
  {
    id: "call-of-war",
    title: "Call of War",
    category: "Estrategia",
    premium: true,
    thumb: "thumb--war",
    initials: "CW",
    image: "img/games/callofwar.webp",
    description:
      "Comandá ejércitos en plena Segunda Guerra Mundial: gestioná recursos, movilizá tropas y conquistá territorios.",
    howTo: "Seleccioná una unidad con el clic izquierdo y enviala a destino con el clic derecho.",
  },
  {
    id: "racing-city",
    title: "Racing City",
    category: "Carreras",
    premium: false,
    thumb: "thumb--racing",
    initials: "RC",
    image: "img/games/racing.webp",
    description:
      "Corré por las calles de la ciudad esquivando el tránsito y superá a tus rivales antes de que termine el tiempo.",
    howTo: "Usá las flechas del teclado para acelerar, frenar y girar.",
  },
  {
    id: "bomb-it-2",
    title: "Bomb It 2",
    category: "Acción",
    premium: false,
    thumb: "thumb--bombit",
    initials: "B2",
    image: "img/games/bomb.webp",
    description:
      "Colocá bombas para abrir camino, derrotar a tus enemigos y sobrevivir en laberintos cada vez más complicados.",
    howTo: "Movete con las flechas y soltá una bomba con la barra espaciadora.",
  },
  {
    id: "comando-force",
    title: "Comando Force",
    category: "Acción",
    premium: true,
    thumb: "thumb--commando",
    initials: "CF",
    image: "img/games/comando.webp",
    description:
      "Sumate a un escuadrón de élite y completá misiones de disparos en primera persona con un arsenal que mejora a medida que avanzás.",
    howTo: "Apuntá con el mouse, disparás con el clic izquierdo y te movés con W, A, S y D.",
  },
  {
    id: "stickman-archer",
    title: "Stickman Archer",
    category: "Acción",
    premium: false,
    thumb: "thumb--stickman",
    initials: "SA",
    image: "img/games/archer.webp",
    description:
      "Ponete en la piel de un arquero y derrotá a tus enemigos con flechas certeras, calculando el ángulo y la fuerza de cada tiro.",
    howTo: "Mantené el clic, arrastrá para apuntar y soltá para disparar.",
  },
  {
    id: "among-us",
    title: "Among Us",
    category: "Multijugador",
    premium: false,
    thumb: "thumb--among",
    initials: "AU",
    image: "img/games/amongus.webp",
    description:
      "Trabajá en equipo para reparar la nave, pero cuidado: hay impostores entre la tripulación. Descubrí quién es antes de que sea tarde.",
    howTo: "Movete con las flechas o el mouse y hacé clic en los objetos para interactuar.",
  },
  {
    id: "trafic-racing",
    title: "Trafic Racing",
    category: "Carreras",
    premium: false,
    thumb: "thumb--traffic",
    initials: "TR",
    image: "img/games/trafficracing.webp",
    description:
      "Recorré la autopista a toda velocidad, adelantá autos y sumá puntos por cada maniobra arriesgada.",
    howTo: "Con las flechas izquierda y derecha cambiás de carril; con arriba y abajo acelerás o frenás.",
  },
  {
    id: "plants-vs-zombies",
    title: "Plants vs Zombies",
    category: "Estrategia",
    premium: false,
    thumb: "thumb--pvz",
    initials: "PZ",
    image: "img/games/plantsvszombies.webp",
    description:
      "Hacé todo lo posible para evitar que los zombies atraviesen el jardín y lleguen a la casa. Para ello, vas a disponer de una defensa de lo más original: una gran variedad de plantas mutantes.",
    howTo: "Elegí una planta con el clic y plantala en una casilla del jardín.",
  },
    {
    id: "bowling",
    title: "Bowling",
    category: "Estrategia",
    premium: false,
    thumb: "thumb--placeholder",
    initials: "B",
    image: "img/games/bowling.webp",
    description: "Completá este juego con tu propio contenido.",
    howTo: "Completá esta descripción con las instrucciones reales del juego.",
  },
  {
    id: "dinosaur",
    title: "Dinosaur Game",
    category: "Arcade",
    premium: false,
    thumb: "thumb--placeholder",
    initials: "D",
    image: "img/games/dinosaur.webp",
    description: "Completá este juego con tu propio contenido.",
    howTo: "Completá esta descripción con las instrucciones reales del juego.",
  },
  {
    id: "Bubble Shooter",
    title: "Bubble Shooter",
    category: "Arcade",
    premium: false,
    thumb: "thumb--placeholder",
    initials: "+",
    image: "img/games/bubble-shooter.webp",
    description: "Completá este juego con tu propio contenido.",
    howTo: "Completá esta descripción con las instrucciones reales del juego.",
  },
];

// Qué juegos muestra cada carrusel de la Home (en orden)
const HOME_SECTIONS = {
  populares: ["slither", "pizza-now", "pirates-peg-solitaire", "cake-cat", "sudoku", "Bubble Shooter"],
  sugerencias: ["fruit-match", "poker", "ajedrez", "call-of-war", "racing-city", "bowling"],
  accion: ["bomb-it-2", "comando-force", "stickman-archer", "among-us", "trafic-racing", "dinosaur"],
};

function getGame(id) {
  return GAMES.find((g) => g.id === id) || null;
}

function gameUrl(id) {
  return "game.html?id=" + encodeURIComponent(id);
}
