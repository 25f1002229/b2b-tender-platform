exports.up = function(knex) {
  return knex.schema.createTable('applications', (table) => {
    table.increments('id').primary();
    table.integer('tender_id').unsigned().notNullable().references('id').inTable('tenders').onDelete('CASCADE');
    table.integer('company_id').unsigned().notNullable().references('id').inTable('companies').onDelete('CASCADE');
    table.text('proposal').notNullable();
    table.decimal('quoted_price', 15, 2);
    table.enum('status', ['submitted', 'under_review', 'accepted', 'rejected']).defaultTo('submitted');
    table.timestamps(true, true);
    
    table.unique(['tender_id', 'company_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('applications');
};
