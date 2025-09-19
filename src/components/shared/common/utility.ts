// countries where only multipliers are offered
const multipliers_only_countries = ['de', 'es', 'it', 'lu', 'gr', 'au', 'fr'];
export const isMultipliersOnly = (country: string) => multipliers_only_countries.includes(country);

// countries where binary options are blocked
const blocked_options_countries = ['au', 'fr'];
export const isOptionsBlocked = (country: string) => blocked_options_countries.includes(country);
