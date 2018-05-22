const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const KarticleSchema = new Schema({
    aid: ObjectId,
    content:String,
    knodes:[String],
    related:[String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: Date
})

var Karticle = mongoose.model('Karticle',KarticleSchema)
module.exports = Karticle;
