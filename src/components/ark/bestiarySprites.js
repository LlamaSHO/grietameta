function tile(index, { cols, rows }) {
  const percentage = (position, count) => count > 1 ? position / (count - 1) * 100 : 0;
  return {
    backgroundPosition: percentage(index % cols, cols) + '% ' + percentage(Math.floor(index / cols), rows) + '%',
    backgroundSize: cols * 100 + '% ' + rows * 100 + '%',
  };
}

export function iconTile(index, sheets) {
  return tile(index, sheets.iconos);
}

export function dossierTile([sheet, index], sheets) {
  const filename = 'dosieres-' + String(sheet + 1).padStart(2, '0') + '.webp';
  return { ...tile(index, sheets.dosieres), backgroundImage: 'url(/images/ark/bestiario/' + filename + ')' };
}