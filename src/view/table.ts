import type { Simulation } from '$/simulation';

function addCell(el: HTMLElement, text: string) {
  const td = document.createElement('td');
  td.textContent = text;
  el.append(td);
  return td;
}

export class TableView {
  birdRows: Record<string, HTMLElement>[] = [];

  constructor(
    private tbody: HTMLElement,
    private simulation: Simulation,
  ) {
    this.simulation.evolution.on('birds', () => {
      this.update();
    });
  }

  select(index: number) {
    const items = [...this.tbody.querySelectorAll('tr')];
    for (const el of items) {
      el.classList.remove('selected');
    }

    items[index]?.classList.add('selected');
  }

  update() {
    this.tbody.innerHTML = '';
    this.birdRows = [];
    for (let i = 0; i < this.simulation.evolution.birds.length; i++) {
      const bird = this.simulation.evolution.birds[i];
      const tr = document.createElement('tr');

      if (i === this.simulation.selectedIndex) {
        tr.classList.add('selected');
      }

      tr.addEventListener('click', () => {
        this.simulation.select(i, true);
      });

      this.birdRows.push({
        index: addCell(tr, `${bird.index}`),
        gen: addCell(tr, `${bird.gen}`),
        source: addCell(tr, `${bird.source}`),
        parents: addCell(
          tr,
          `${bird.lineage?.map(parent => `${parent.gen}[${parent.index}]`).join(' x ') ?? 'none'}`,
        ),
        x: addCell(tr, `${bird.x}`),
      });
      this.tbody.append(tr);
    }
  }

  dynamicUpdate() {
    const items = [...this.tbody.querySelectorAll('tr')];
    for (let i = 0; i < items.length; i++) {
      const bird = this.simulation.evolution.birds[i];
      const row = this.birdRows[i];
      if (bird && row) {
        row.index.textContent = `${bird.index}${!bird.alive ? ' (dead)' : ''}`;
        row.x.textContent = `${Math.floor(bird.x)}`;
      }
    }
  }

  reset() {
    this.tbody.innerHTML = '';
  }
}
