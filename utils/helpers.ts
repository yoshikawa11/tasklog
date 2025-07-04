export function isOptionEnabled(val: unknown): boolean {
  return val === true || val === "true" || val === "";
}

export function handleError(context: string) {
  return (err: unknown) => {
    console.error(`${context}中にエラーが発生しました:`, err);
  };
}
