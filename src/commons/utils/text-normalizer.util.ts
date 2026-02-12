const ACCENTED_CHARS = 'áéíóúàèìòùäëïöüâêîôûñÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÂÊÎÔÛÑ';

const NORMALIZED_CHARS = 'aeiouaeiouaeiouaeiounAEIOUAEIOUAEIOUAEIOUN';

export function normalizeText(text: string): string {
  if (!text) {
    return '';
  }

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function normalizeColumn(columnName: string): string {
  return `LOWER(TRANSLATE(${columnName}, '${ACCENTED_CHARS}', '${NORMALIZED_CHARS}'))`;
}

export function buildSearchCondition(
  columns: string[],
  paramName: string,
): string {
  const conditions = columns.map(
    (column) => `${normalizeColumn(column)} LIKE :${paramName}`,
  );
  return `(${conditions.join(' OR ')})`;
}
