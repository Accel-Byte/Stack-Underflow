module.exports.paginateResults = ({
  after: cursor,
  pageSize = 8,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}) => {
  if (pageSize < 1) return [];
  if (!results || results.length === 0) {
    return [];
  }
  if (!cursor) return results.slice(0, pageSize);
  
  const cursorIndex = results.findIndex((item) => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item._id ? item._id : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor.toString() : false;
  });
  
  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);
};
