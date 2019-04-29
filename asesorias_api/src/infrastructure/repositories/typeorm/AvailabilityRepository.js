const Joi = require('joi');

const { basePath } = global;
const { polyfill } = require(`${basePath}/helpers`);
const { Disponibilidad } = require(`${basePath}/src/inote/domain/models`);

/**
 * Valida que exista la id de la disponibilidad, de esta forma se sabe que
 * esta guardada de base de datos
 * @param {Disponibilidad} disponibilidad
 */
function assertThatDisponibilidadIsUpdatable(disponibilidad) {
  if (polyfill.empty(disponibilidad.id)) {
    const err = new Error('No se puede actualizar la disponibilidad');
    err.code = 500;
    throw err;
  }
}

/**
 * Valida que la disponibilidad exista
 * @param {Disponibilidad} disponibilidad
 */
function assertThatDisponibilidadIsNotEmpty(disponibilidad) {
  if (polyfill.empty(disponibilidad)) {
    const err = new Error('No se encontró la disponibilidad');
    err.code = 404;
    throw err;
  }
}

/**
 * Valida que la uuid recibida tenga un formato correcto
 * @param {string} uuid
 */
function assertThatUuidIsValid(uuid) {
  const joiError = Joi.string().guid().validate(uuid).error;

  if (polyfill.isset(joiError)) {
    joiError.code = 400;
    throw joiError;
  }
}

/**
 * Valida que el objeto recibido sea una instancia de Disponibilidad.
 * @param {Disponibilidad} disponibilidad
 */
function assertThatIsDisponibilidad(disponibilidad) {
  if (!(disponibilidad instanceof Disponibilidad)) {
    throw new TypeError('No se recibio un modelo de disponibilidad');
  }
}

class AvailabilityRepository {
  constructor(connection) {
    if (polyfill.isset(connection)) {
      this.repository = connection.getRepository(Disponibilidad);
    }
  }

  /**
   * Método encargado de guardar una disponibilidad.
   * @param {Disponibilidad} disponibilidad
   */
  create(disponibilidad) {
    assertThatIsDisponibilidad(disponibilidad);
    return this.persist(disponibilidad);;
  }

  /**
   * Método encargado de de encontrar disponibilidads dados ciertos filtros.
   * @param {Object} filters
   */
  get(filters) {
    const [skip, take] = filters.limit;
    return this.find({ ...filters }, { skip, take });
  }

  /**
   * Método encargado de encontrar una Disponibilidad por su uuid
   * @param {string} uuid
   */
  async byUuidOrFail(uuid) {
    assertThatUuidIsValid(uuid);
    const res = await this.find({ uuid });
    assertThatDisponibilidadIsNotEmpty(res[0]);

    return res[0];
  }

  /**
   * Método encargado de actualizar una disponibilidad
   * @param {Disponibilidad} disponibilidad
   */
  async update(disponibilidad) {
    assertThatDisponibilidadIsUpdatable(disponibilidad);
    return this.persist(disponibilidad);
  }

  /**
   * Método encargado de obtener el conteo de objetos.
   * @param {Object} filters
   */
  async count(filters = {}) {
    const [skip, take] = filters.limit;
    const count = await this.repository.count({ where: { ...filters }, skip, take });
    return count;
  }

  /**
   * Método encargado de persistir la disponibilidad en la base de datos.
   * @param {Disponibilidad} item
   */
  persist(item) {
    return this.repository.save(item);
  }

  /**
   * Método encargado de buscar disponibilidads en la base de datos.
   * @param {Object} params
   */
  find(params = {}, limit = {}) {
    return this.repository.find({ where: { ...params }, relations: ['nidInterconsulta'], ...limit });
  }
}

module.exports = AvailabilityRepository;
