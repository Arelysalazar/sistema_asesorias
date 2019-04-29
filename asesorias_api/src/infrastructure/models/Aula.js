const {basePath} = global;

const { EntitySchema } = require('typeorm');
const { Aula: AulaModel } = require(`${basePath}/src/domain/`);

const Aula = new EntitySchema({
  name: 'Aula',
  tableName: 'aula',
  target: AulaModel,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
      nullable: false,
    },
    edificio: {
      type: String,
      nullable: false,
    },
    noAsignacion: {
      type: String,
      nullable: false,
      name: 'no_asignacion',
    },
    nota: {
      type: String,
      nullable: true,
    }
  }
});

module.exports = Aula;