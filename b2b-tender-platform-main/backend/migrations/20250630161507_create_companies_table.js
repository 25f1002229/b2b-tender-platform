exports.up = function(knex) {
  return knex.schema.createTable('companies', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('industry');
    table.text('description');
    table.string('logo_url');
    table.jsonb('services_offered').defaultTo('[]');
    table.timestamps(true, true);
    
    // Add full-text search column
    table.specificType('search_vector', 'tsvector');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('companies');
};
