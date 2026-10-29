const COLUMN_COUNT = 6;
const TILES_PER_COPY = 3;
const COLUMN_DURATIONS = [
  "78s",
  "56s",
  "92s",
  "64s",
  "84s",
  "70s",
  "98s",
  "60s",
  "86s",
];
// Colunas estreitas e em maior numero: como a altura do tile deriva da largura da
// coluna, poucas colunas produziriam blocos enormes e a parede deixaria de ler como
// grid.
//
// Larguras desiguais por coluna: e o que faz um projeto aparecer estreito numa
// coluna e largo na vizinha. Isso so e seguro por causa das tres copias: como a
// altura do tile deriva da largura, coluna estreita tem ciclo mais curto, e com
// duas copias a mais estreita deixava de cobrir e abria vao.
const COLUMN_FLEX = [1.28, 0.78, 1.12, 0.7, 1.34, 0.88];

// Formas canonicas de bento. A proporcao crua do arquivo escolhe a familia, entao
// um app continua vertical e um site continua horizontal; dentro da familia ha duas
// variantes, alternadas por posicao, para o mesmo projeto nao repetir a mesma caixa
// toda vez que aparece. Usar a razao crua achataria a variedade: os tres retratos
// de 0.8 sairiam quase quadrados e a parede perderia o contraste de formas.
const FAMILIAS = [
  { limite: 1.6, formas: [2, 1.5] }, // horizontal deitado e paisagem
  { limite: 0.9, formas: [1, 1.25] }, // quadrado e quase quadrado
  { limite: 0.62, formas: [0.75, 0.8] }, // retrato
  { limite: 0, formas: [0.5, 0.62] }, // vertical alto
];

const formaDoTile = (aspect, slot, column) => {
  const familia =
    FAMILIAS.find((f) => aspect >= f.limite) ?? FAMILIAS[FAMILIAS.length - 1];
  return familia.formas[(slot + column) % familia.formas.length];
};

// Um "papel de parede" montado com os proprios projetos: colunas inclinadas que
// derivam em sentidos alternados.
//
// Sao QUATRO copias curtas em vez de tres longas. Com N copias centradas e
// deslocamento de uma, a cobertura exige C >= V/(N-2): com N=3 seria C >= V, com
// N=4 basta C >= V/2. Como a altura total da coluna e N*C, copias mais curtas e em
// maior numero cobrem o mesmo com bem menos textura -- a coluna caiu de ~9600px
// para ~4000px, e e isso que estava pesando na GPU.
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// Menor passo a partir de 3 que seja coprimo com o total de projetos. Calculado
// em vez de fixo porque um passo que divide o total (3 com 9 projetos) faria
// cada coluna repetir so um terco da lista.
const strideFor = (total) => {
  let stride = 3;
  while (gcd(stride, total) !== 1) stride += 1;
  return stride;
};

function buildColumn(projects, column) {
  const stride = strideFor(projects.length);
  return Array.from({ length: TILES_PER_COPY }, (_, slot) => {
    // Passo coprimo com o total, entao cada coluna percorre a lista em uma
    // ordem diferente e a repeticao fica menos evidente.
    return projects[(column + slot * stride) % projects.length];
  });
}

export function ProjectWall({ projects }) {
  return (
    <div className="project-wall" aria-hidden="true">
      {/* Sticky de uma viewport: a parede acompanha a rolagem em vez de cobrir a
          secao inteira, entao uma copia curta da coluna ja fecha o loop. */}
      <div className="project-wall-viewport">
        <div className="project-wall-plane">
          {Array.from({ length: COLUMN_COUNT }, (_, column) => {
            const tiles = buildColumn(projects, column);

            return (
              <div
                className={`project-wall-col ${column % 2 === 0 ? "is-up" : "is-down"}`}
                key={column}
                style={{
                  "--wall-duration": COLUMN_DURATIONS[column],
                  flexGrow: COLUMN_FLEX[column],
                }}
              >
                {[0, 1, 2, 3].map((copy) =>
                  tiles.map((tile, slot) => (
                    <span
                      className="project-wall-tile"
                      key={`${copy}-${slot}`}
                      style={{
                        "--tile-ar": formaDoTile(tile.aspect, slot, column),
                      }}
                    >
                      <img
                        src={tile.wallImage}
                        alt=""
                        loading="eager"
                        decoding="async"
                      />
                    </span>
                  )),
                )}
              </div>
            );
          })}
        </div>

        {/* O acrilico vive dentro da viewport sticky, nao cobrindo a secao inteira:
            assim ocupa uma tela em vez da altura toda e a camada cai de ~33MB. */}
        <div className="project-wall-frost" />
      </div>
    </div>
  );
}
