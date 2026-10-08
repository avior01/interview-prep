// Companies a question can be tagged with (content `tags`) and the interview target in settings.
export const COMPANIES = { nvidia: 'NVIDIA', microsoft: 'Microsoft', meta: 'Meta', apple: 'Apple', google: 'Google', amazon: 'Amazon', qualcomm: 'Qualcomm', intel: 'Intel' };
export const companyName = (id) => COMPANIES[id] || id;
