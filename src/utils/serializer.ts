export const serialize = (obj: Object) => {
  const buffer = Buffer.from(JSON.stringify(obj));
  return new Uint8Array(buffer);
};

export const deserialize = (buffer: Uint8Array) => {
  const json = JSON.parse(buffer.toString());
  return new Object(json);
};
