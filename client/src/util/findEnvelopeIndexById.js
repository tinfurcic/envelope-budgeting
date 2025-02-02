export const findEnvelopeIndexById = (envelopes, envelopeId) => {
  const envelopeIdNum = Number(envelopeId);
  const envelopeIndex = envelopes.findIndex(
    (element) => element.id === envelopeIdNum,
  );
  if (envelopeIndex === -1) {
    throw new Error("Can't find that envelope! (wrong or missing id)");
  }
  return envelopeIndex;
};
