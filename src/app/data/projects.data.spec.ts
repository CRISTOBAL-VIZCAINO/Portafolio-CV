import { PROJECTS } from './projects.data';

describe('PROJECTS (contenido)', () => {
  it('cada proyecto tiene un id único (se usa como ancla #id en las URLs)', () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
  });

  it('las capturas y portadas apuntan a public/images/projects/ y tienen texto alternativo', () => {
    for (const project of PROJECTS) {
      for (const image of project.images) {
        expect(image.src).toMatch(/^images\/projects\/[a-z0-9-]+\/\d{2}\.webp$/);
        expect(image.alt.trim()).not.toBe('');
        expect(image.caption.trim()).not.toBe('');
      }
      if (project.cover) {
        expect(project.images.map((i) => i.src)).toContain(project.cover);
      }
    }
  });

  it('las tecnologías tienen logo o ícono genérico', () => {
    for (const item of PROJECTS.flatMap((p) => p.techs)) {
      expect(item.icon ?? item.glyph).withContext(item.label).toBeTruthy();
    }
  });
});
