let envelopes = [
    { id: 1, name: 'Groceries', budget: 500, balance: 500 },
    { id: 2, name: 'Rent', budget: 1500, balance: 1500 },
    { id: 3, name: 'Utilities', budget: 300, balance: 300 }
];

let nextId = 4;

const getAll = () => envelopes;

const getById = (id) => envelopes.find(e => e.id === id);

const getTotalBudget = () =>
  envelopes.reduce((sum, e) => sum + e.budget, 0);

const create = (name, budget) => {
  const env = { id: nextId++, name, budget, balance: budget };
  envelopes.push(env);
  return env;
};

const update = (id, updates) => {
  const env = getById(id);
  if (!env) return null;
  if (updates.name) env.name = updates.name;
  if (updates.budget) env.budget = updates.budget;
  return env;
};

const remove = (id) => {
  const index = envelopes.findIndex(e => e.id === id);
  if (index === -1) return false;
  envelopes.splice(index, 1);
  return true;
};

module.exports = {
  getAll,
  getById,
  getTotalBudget,
  create,
  update,
  remove
};