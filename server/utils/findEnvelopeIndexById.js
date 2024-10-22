import { envelopes } from "../envelope.js";

export const findEnvelopeIndexById = (envelopeId) => {
    const envelopeIndex = envelopes.findIndex((element) => element.id === envelopeId);
    if (envelopeIndex === -1) {
        throw new Error ("Can't find that envelope! (wrong or missing id)");
    }
    return envelopeIndex;
}