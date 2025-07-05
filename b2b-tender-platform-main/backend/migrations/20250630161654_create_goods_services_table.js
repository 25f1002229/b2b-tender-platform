exports.up = function(knex) {
  return knex.schema.createTable('goods_services', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('category');
    table.text('description');
    table.integer('company_id').unsigned().notNullable().references('id').inTable('companies').onDelete('CASCADE');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('goods_services');
};
