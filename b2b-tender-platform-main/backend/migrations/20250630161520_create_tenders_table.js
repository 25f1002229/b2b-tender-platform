exports.up = function(knex) {
  return knex.schema.createTable('tenders', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.decimal('budget', 15, 2);
    table.date('deadline');
    table.integer('company_id').unsigned().notNullable().references('id').inTable('companies').onDelete('CASCADE');
    table.enum('status', ['draft', 'active', 'closed', 'awarded']).defaultTo('draft');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tenders');
};
