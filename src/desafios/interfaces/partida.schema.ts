import mongoose from "mongoose";

export const PartidaSchema = new mongoose.Schema({
  def: { type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' },
  jogadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' }],
  resultado: [{ set: { type: String } }],
  categoria: { type: String }
}, { timestamps: true, collection: 'partidas' });
